import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: plans, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("amount_cents")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      plans: plans?.map((plan) => ({
        ...plan,
        amount: plan.amount_cents / 100,
      })),
    })
  } catch (error) {
    console.error("[v0] Fetch plans error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
