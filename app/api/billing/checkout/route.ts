import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Mock Stripe integration (would use real Stripe SDK in production)
const MOCK_STRIPE_ENABLED = true

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
    const { plan_id } = body

    if (!plan_id) {
      return NextResponse.json({ error: "Missing plan_id" }, { status: 400 })
    }

    // Fetch plan
    const { data: plan } = await supabase.from("subscription_plans").select("*").eq("id", plan_id).single()

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    // Mock checkout session creation
    // In production, this would call Stripe API
    const checkoutSession = {
      id: `cs_${Date.now()}`,
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/billing/success?session_id=${Date.now()}`,
      client_secret: `cs_secret_${Date.now()}`,
    }

    return NextResponse.json({
      session: checkoutSession,
      message: "Checkout session created (mock)",
    })
  } catch (error) {
    console.error("[v0] Checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
