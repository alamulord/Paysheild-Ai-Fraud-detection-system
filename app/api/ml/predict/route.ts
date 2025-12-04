import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { predictWithModel } from "@/lib/ml-service"
import type { Transaction, Merchant } from "@/lib/types"

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
    const { transaction, merchant_id, model_id } = body

    if (!transaction || !merchant_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Fetch active model if not specified
    let modelToUse = model_id
    if (!modelToUse) {
      const { data: activeModels } = await supabase
        .from("ml_models")
        .select("*")
        .eq("is_active", true)
        .order("deployed_at", { ascending: false })
        .limit(1)

      if (!activeModels || activeModels.length === 0) {
        return NextResponse.json({ error: "No active ML model found" }, { status: 404 })
      }
      modelToUse = activeModels[0].id
    }

    // Fetch merchant data for context
    const { data: merchant } = await supabase.from("merchants").select("*").eq("id", merchant_id).single()

    // Get prediction
    const prediction = await predictWithModel(supabase, transaction as Transaction, merchant as Merchant, modelToUse)

    return NextResponse.json({
      prediction: {
        fraud_probability: prediction.fraud_probability,
        risk_level: prediction.risk_level,
        confidence: prediction.confidence,
        recommended_action: prediction.recommended_action,
        model_id: modelToUse,
      },
    })
  } catch (error) {
    console.error("[v0] Prediction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
