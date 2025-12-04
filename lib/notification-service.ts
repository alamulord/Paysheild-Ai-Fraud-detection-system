import type { SupabaseClient } from "@supabase/supabase-js"
import type { Alert, Merchant } from "./types"

interface NotificationPreferences {
  email_alerts: boolean
  webhook_alerts: boolean
  sms_alerts: boolean
  alert_threshold: number
  notify_on_critical: boolean
  notify_on_high: boolean
  notify_on_medium: boolean
  email_recipients: string[]
  webhook_url?: string
}

export async function sendAlert(supabase: SupabaseClient, alert: Alert, merchant: Merchant): Promise<void> {
  try {
    // Fetch merchant notification preferences
    const { data: prefs } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("merchant_id", merchant.id)
      .single()

    if (!prefs) {
      console.log("[v0] No notification preferences found for merchant")
      return
    }

    // Check if alert should be sent based on severity
    if (!shouldSendAlert(alert.severity, prefs)) {
      console.log("[v0] Alert below threshold, skipping notification")
      return
    }

    // Send notifications based on preferences
    const notifications: Promise<void>[] = []

    if (prefs.email_alerts && prefs.email_recipients?.length > 0) {
      notifications.push(sendEmailNotification(supabase, alert, merchant, prefs.email_recipients))
    }

    if (prefs.webhook_alerts && prefs.webhook_url) {
      notifications.push(sendWebhookNotification(supabase, alert, merchant, prefs.webhook_url))
    }

    if (prefs.sms_alerts) {
      notifications.push(sendSMSNotification(supabase, alert, merchant))
    }

    await Promise.allSettled(notifications)
  } catch (error) {
    console.error("[v0] Alert sending error:", error)
  }
}

function shouldSendAlert(severity: string, prefs: NotificationPreferences): boolean {
  switch (severity) {
    case "critical":
      return prefs.notify_on_critical
    case "warning":
      return prefs.notify_on_high
    case "info":
      return prefs.notify_on_medium
    default:
      return false
  }
}

async function sendEmailNotification(
  supabase: SupabaseClient,
  alert: Alert,
  merchant: Merchant,
  recipients: string[],
): Promise<void> {
  console.log("[v0] Sending email notification to:", recipients)

  const emailBody = `
Fraud Detection Alert

Alert: ${alert.title}
Severity: ${alert.severity}
Description: ${alert.description}
Time: ${new Date(alert.created_at).toISOString()}

Please log in to your Fraud Guard dashboard to review this alert.
  `.trim()

  // Log notification
  for (const recipient of recipients) {
    await supabase.from("notification_logs").insert({
      id: crypto.randomUUID(),
      merchant_id: merchant.id,
      alert_id: alert.id,
      created_at: new Date().toISOString(),
      notification_type: "email",
      recipient,
      status: "sent",
      metadata: { subject: `Fraud Guard Alert: ${alert.title}` },
    })
  }

  // In production, integrate with email service (SendGrid, AWS SES, etc.)
}

async function sendWebhookNotification(
  supabase: SupabaseClient,
  alert: Alert,
  merchant: Merchant,
  webhookUrl: string,
): Promise<void> {
  console.log("[v0] Sending webhook notification to:", webhookUrl)

  const payload = {
    event: "fraud_alert",
    timestamp: new Date().toISOString(),
    merchant_id: merchant.id,
    alert: {
      id: alert.id,
      type: alert.alert_type,
      severity: alert.severity,
      title: alert.title,
      description: alert.description,
      transaction_id: alert.transaction_id,
    },
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const status = response.ok ? "sent" : "failed"

    await supabase.from("notification_logs").insert({
      id: crypto.randomUUID(),
      merchant_id: merchant.id,
      alert_id: alert.id,
      created_at: new Date().toISOString(),
      notification_type: "webhook",
      recipient: webhookUrl,
      status,
      metadata: { status_code: response.status },
    })
  } catch (error) {
    console.error("[v0] Webhook notification error:", error)

    await supabase.from("notification_logs").insert({
      id: crypto.randomUUID(),
      merchant_id: merchant.id,
      alert_id: alert.id,
      created_at: new Date().toISOString(),
      notification_type: "webhook",
      recipient: webhookUrl,
      status: "failed",
      error_message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

async function sendSMSNotification(supabase: SupabaseClient, alert: Alert, merchant: Merchant): Promise<void> {
  console.log("[v0] SMS notification not implemented yet")

  // In production, integrate with SMS service (Twilio, etc.)
  await supabase.from("notification_logs").insert({
    id: crypto.randomUUID(),
    merchant_id: merchant.id,
    alert_id: alert.id,
    created_at: new Date().toISOString(),
    notification_type: "sms",
    status: "pending",
  })
}
