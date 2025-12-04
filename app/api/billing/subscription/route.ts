import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*, subscription_plans(*)")
      .eq("merchant_id", user.id)
      .eq("status", "active")
      .single()

    if (error || !subscription) {
      return NextResponse.json({ subscription: null }, { status: 200 })
    }

    return NextResponse.json({
      subscription: {
        ...subscription,
        plan: subscription.subscription_plans,
      },
    })
  } catch (error) {
    console.error("[v0] Fetch subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    // Mock subscription creation
    const stripeCustomerId = `cus_${Date.now()}`
    const stripeSubscriptionId = `sub_${Date.now()}`

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .insert({
        id: crypto.randomUUID(),
        merchant_id: user.id,
        plan_id,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      subscription,
      message: "Subscription created successfully (mock)",
    })
  } catch (error) {
    console.error("[v0] Create subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
