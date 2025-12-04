import type { SupabaseClient } from "@supabase/supabase-js"
import type { Transaction, Merchant } from "./types"

interface FraudSignalResult {
  signal_type: string
  score: number
  severity: "low" | "medium" | "high" | "critical"
  description: string
}

export async function analyzeFraudRisk(
  supabase: SupabaseClient,
  transaction: Transaction,
  merchant: Merchant,
): Promise<{
  riskScore: number
  signals: FraudSignalResult[]
  riskLevel: "low" | "medium" | "high" | "critical"
  isLikelyFraud: boolean
}> {
  const signals: FraudSignalResult[] = []
  let totalScore = 0

  // Check if entity is blacklisted
  const { data: blacklisted } = await supabase
    .from("entity_lists")
    .select("*")
    .eq("merchant_id", merchant.id)
    .eq("list_type", "blacklist")
    .or(
      `entity_value.eq.${transaction.customer_email},entity_value.eq.${transaction.customer_ip},entity_value.eq.${transaction.card_last_four}`,
    )

  if (blacklisted && blacklisted.length > 0) {
    signals.push({
      signal_type: "blacklisted_entity",
      score: 40,
      severity: "high",
      description: "Entity found in merchant blacklist",
    })
    totalScore += 40
  }

  // Check if entity is whitelisted
  const { data: whitelisted } = await supabase
    .from("entity_lists")
    .select("*")
    .eq("merchant_id", merchant.id)
    .eq("list_type", "whitelist")
    .or(`entity_value.eq.${transaction.customer_email},entity_value.eq.${transaction.customer_ip}`)

  if (whitelisted && whitelisted.length > 0) {
    totalScore = Math.max(0, totalScore - 25)
  }

  // Velocity check: multiple transactions from same IP in short time
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const { count: ipVelocity } = await supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .eq("merchant_id", merchant.id)
    .eq("customer_ip", transaction.customer_ip)
    .gte("created_at", fiveMinutesAgo)
    .eq("status", "approved")

  if ((ipVelocity || 0) > 5) {
    signals.push({
      signal_type: "high_velocity_ip",
      score: 35,
      severity: "high",
      description: `${ipVelocity} transactions from this IP in last 5 minutes`,
    })
    totalScore += 35
  }

  // Geographic anomaly: transaction from unusual location
  if (transaction.geographic_location) {
    const { data: recentTxs } = await supabase
      .from("transactions")
      .select("geographic_location")
      .eq("merchant_id", merchant.id)
      .eq("customer_id", transaction.customer_id)
      .order("created_at", { ascending: false })
      .limit(1)

    if (recentTxs && recentTxs.length > 0) {
      const lastLocation = recentTxs[0].geographic_location
      if (lastLocation && hasGeographicAnomaly(lastLocation, transaction.geographic_location)) {
        signals.push({
          signal_type: "geographic_anomaly",
          score: 30,
          severity: "medium",
          description: "Transaction from unusual geographic location",
        })
        totalScore += 30
      }
    }
  }

  // Amount anomaly: unusually large transaction
  if (transaction.amount > (merchant.settings?.average_transaction_amount || 1000) * 3) {
    signals.push({
      signal_type: "large_transaction",
      score: 20,
      severity: "medium",
      description: `Large transaction amount: $${transaction.amount}`,
    })
    totalScore += 20
  }

  // New customer risk
  const { count: customerTxCount } = await supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .eq("merchant_id", merchant.id)
    .eq("customer_id", transaction.customer_id)

  if ((customerTxCount || 0) === 0) {
    signals.push({
      signal_type: "new_customer",
      score: 15,
      severity: "low",
      description: "First transaction from this customer",
    })
    totalScore += 15
  }

  // Calculate final risk level
  const riskScore = Math.min(100, totalScore)
  let riskLevel: "low" | "medium" | "high" | "critical"

  if (riskScore < 30) {
    riskLevel = "low"
  } else if (riskScore < 60) {
    riskLevel = "medium"
  } else if (riskScore < 80) {
    riskLevel = "high"
  } else {
    riskLevel = "critical"
  }

  const isLikelyFraud = riskScore >= 70

  return {
    riskScore,
    signals,
    riskLevel,
    isLikelyFraud,
  }
}

function hasGeographicAnomaly(lastLocation: Record<string, any>, currentLocation: Record<string, any>): boolean {
  if (!lastLocation.latitude || !currentLocation.latitude) return false

  const distance = calculateDistance(
    lastLocation.latitude,
    lastLocation.longitude,
    currentLocation.latitude,
    currentLocation.longitude,
  )

  // If more than 500 miles in less than 1 hour, it's anomalous
  return distance > 500
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
