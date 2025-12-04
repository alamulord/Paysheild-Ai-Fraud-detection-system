import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { analyzeFraudRisk } from "@/lib/fraud-engine"
import type { Transaction, FraudSignal } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const transaction = body as Transaction

    // Validate transaction data
    if (!transaction.merchant_id || !transaction.amount || !transaction.customer_id) {
      return NextResponse.json({ error: "Missing required transaction fields" }, { status: 400 })
    }

    // Get merchant to verify ownership
    const { data: merchant, error: merchantError } = await supabase
      .from("merchants")
      .select("*")
      .eq("id", transaction.merchant_id)
      .single()

    if (merchantError || !merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 })
    }

    // Insert transaction
    const { data: txData, error: txError } = await supabase.from("transactions").insert(transaction).select().single()

    if (txError || !txData) {
      return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
    }

    // Analyze fraud risk
    const { riskScore, signals, riskLevel, isLikelyFraud } = await analyzeFraudRisk(supabase, txData, merchant)

    // Store fraud signals
    if (signals.length > 0) {
      const signalsData: FraudSignal[] = signals.map((signal) => ({
        id: crypto.randomUUID(),
        transaction_id: txData.id,
        merchant_id: transaction.merchant_id,
        created_at: new Date().toISOString(),
        ...signal,
      }))

      await supabase.from("fraud_signals").insert(signalsData)
    }

    // Store risk assessment
    const { error: riskError } = await supabase.from("risk_assessments").insert({
      id: crypto.randomUUID(),
      transaction_id: txData.id,
      merchant_id: transaction.merchant_id,
      created_at: new Date().toISOString(),
      overall_risk_score: riskScore,
      risk_level: riskLevel,
      model_version: "1.0.0",
      is_fraudulent: isLikelyFraud,
      features_used: { signal_count: signals.length },
    })

    if (riskError) {
      console.error("[v0] Risk assessment error:", riskError)
    }

    // Create alert if high risk
    if (riskScore >= 70) {
      await supabase.from("alerts").insert({
        id: crypto.randomUUID(),
        merchant_id: transaction.merchant_id,
        transaction_id: txData.id,
        created_at: new Date().toISOString(),
        alert_type: "high_fraud_risk",
        severity: riskScore >= 90 ? "critical" : "warning",
        title: `High fraud risk detected for transaction ${txData.id}`,
        description: `Risk score: ${riskScore}. ${signals.length} fraud signals detected.`,
        status: "open",
      })
    }

    // Update transaction status based on risk
    if (isLikelyFraud) {
      await supabase.from("transactions").update({ status: "flagged" }).eq("id", txData.id)
    }

    return NextResponse.json({
      transaction: txData,
      risk_assessment: {
        risk_score: riskScore,
        risk_level: riskLevel,
        is_fraudulent: isLikelyFraud,
        signal_count: signals.length,
      },
    })
  } catch (error) {
    console.error("[v0] Transaction analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
