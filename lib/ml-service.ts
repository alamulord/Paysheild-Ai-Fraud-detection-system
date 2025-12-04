import type { SupabaseClient } from "@supabase/supabase-js"
import type { Transaction, Merchant } from "./types"

interface TrainingResult {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  metrics: Record<string, any>
  training_samples: number
  training_duration: number
}

interface PredictionResult {
  fraud_probability: number
  risk_level: "low" | "medium" | "high" | "critical"
  confidence: number
  recommended_action: "approve" | "review" | "decline"
}

export async function trainMLModel(
  supabase: SupabaseClient,
  model: any,
  training_days: number,
): Promise<TrainingResult> {
  const startTime = Date.now()

  // Fetch training data
  const trainingStartDate = new Date()
  trainingStartDate.setDate(trainingStartDate.getDate() - training_days)

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, fraud_signals(*), risk_assessments(*)")
    .gte("created_at", trainingStartDate.toISOString())
    .limit(10000)

  if (!transactions || transactions.length === 0) {
    return {
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1_score: 0,
      metrics: { samples: 0 },
      training_samples: 0,
      training_duration: Date.now() - startTime,
    }
  }

  // Extract features and labels
  const features = transactions.map((tx) => extractFeatures(tx))
  const labels = transactions.map((tx) => {
    const risk = tx.risk_assessments?.[0]
    return risk?.is_fraudulent ? 1 : 0
  })

  // Simulate ML training with simple metrics calculation
  const fraudCount = labels.filter((l) => l === 1).length
  const nonFraudCount = labels.filter((l) => l === 0).length

  // Calculate metrics based on distribution
  const accuracy = Math.min(0.95, 0.7 + (nonFraudCount / transactions.length) * 0.25)
  const precision = Math.min(0.92, 0.6 + (fraudCount / transactions.length) * 0.3)
  const recall = Math.min(0.88, 0.5 + (fraudCount / transactions.length) * 0.35)
  const f1_score = (2 * (precision * recall)) / (precision + recall || 1)

  const trainingDuration = Date.now() - startTime

  return {
    accuracy,
    precision,
    recall,
    f1_score,
    metrics: {
      fraud_samples: fraudCount,
      non_fraud_samples: nonFraudCount,
      total_samples: transactions.length,
      feature_count: 12,
    },
    training_samples: transactions.length,
    training_duration: trainingDuration,
  }
}

export async function predictWithModel(
  supabase: SupabaseClient,
  transaction: Transaction,
  merchant: Merchant,
  model_id: string,
): Promise<PredictionResult> {
  // Fetch model details
  const { data: model } = await supabase.from("ml_models").select("*").eq("id", model_id).single()

  // Extract features from transaction
  const features = extractFeatures({
    ...transaction,
    risk_assessments: [],
  })

  // Simulate ML prediction
  const baseScore = calculateRiskScore(features)
  const modelAccuracy = model?.accuracy || 0.85

  // Calculate fraud probability based on features and model accuracy
  const fraudProbability = baseScore * modelAccuracy

  // Apply confidence based on model performance
  const confidence = Math.min(0.95, Math.max(0.5, modelAccuracy))

  let riskLevel: "low" | "medium" | "high" | "critical"
  let recommendedAction: "approve" | "review" | "decline"

  if (fraudProbability < 0.3) {
    riskLevel = "low"
    recommendedAction = "approve"
  } else if (fraudProbability < 0.6) {
    riskLevel = "medium"
    recommendedAction = "review"
  } else if (fraudProbability < 0.8) {
    riskLevel = "high"
    recommendedAction = "review"
  } else {
    riskLevel = "critical"
    recommendedAction = "decline"
  }

  return {
    fraud_probability: Math.min(1, fraudProbability),
    risk_level: riskLevel,
    confidence,
    recommended_action: recommendedAction,
  }
}

function extractFeatures(transaction: any): Record<string, number> {
  return {
    amount_log: Math.log(transaction.amount + 1),
    hour_of_day: new Date(transaction.created_at).getHours(),
    is_weekend: [0, 6].includes(new Date(transaction.created_at).getDay()) ? 1 : 0,
    has_email: transaction.customer_email ? 1 : 0,
    has_device_fingerprint: transaction.device_fingerprint ? 1 : 0,
    transaction_velocity: 0.5,
    geographic_risk: 0.3,
    customer_age_days: 30,
    email_domain_risk: 0.2,
    ip_reputation: 0.4,
    card_velocity: 0.25,
    merchant_risk_profile: 0.35,
  }
}

function calculateRiskScore(features: Record<string, number>): number {
  const weights: Record<string, number> = {
    amount_log: 0.15,
    hour_of_day: 0.08,
    is_weekend: 0.05,
    has_email: -0.1,
    has_device_fingerprint: -0.12,
    transaction_velocity: 0.2,
    geographic_risk: 0.18,
    customer_age_days: -0.15,
    email_domain_risk: 0.12,
    ip_reputation: 0.15,
    card_velocity: 0.18,
    merchant_risk_profile: 0.1,
  }

  let score = 0
  for (const [feature, value] of Object.entries(features)) {
    score += (value || 0) * (weights[feature] || 0)
  }

  return Math.max(0, Math.min(1, 0.5 + score))
}
