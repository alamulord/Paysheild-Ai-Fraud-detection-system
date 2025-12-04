import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Mock webhook handler for Stripe events
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.text()

    // In production, verify Stripe signature here
    const event = JSON.parse(body)

    console.log("[v0] Webhook event:", event.type)

    switch (event.type) {
      case "customer.subscription.updated": {
        const subscription = event.data.object

        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id)

        if (error) console.error("[v0] Update subscription error:", error)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object

        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id)

        if (error) console.error("[v0] Cancel subscription error:", error)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object

        const { error } = await supabase.from("billing_transactions").insert({
          id: crypto.randomUUID(),
          stripe_payment_id: invoice.id,
          amount_cents: invoice.amount_paid,
          currency: invoice.currency,
          status: "succeeded",
          invoice_url: invoice.hosted_invoice_url,
          metadata: { event_type: event.type },
        })

        if (error) console.error("[v0] Log payment error:", error)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object

        await supabase.from("billing_transactions").insert({
          id: crypto.randomUUID(),
          stripe_payment_id: invoice.id,
          amount_cents: invoice.amount_paid || 0,
          currency: invoice.currency,
          status: "failed",
          metadata: { event_type: event.type, error: invoice.last_finalization_error },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
