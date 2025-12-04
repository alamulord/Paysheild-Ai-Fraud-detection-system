// TypeScript types for fraud detection system
export interface Merchant {
  id: string
  created_at: string
  email: string
  business_name: string
  api_key: string
  status: "active" | "suspended" | "inactive"
  tier: "starter" | "standard" | "premium" | "enterprise"
  webhook_url?: string
  settings?: Record<string, any>
  metadata?: Record<string, any>
}

export interface Transaction {
  id: string
  merchant_id: string
  created_at: string
  amount: number
  currency: string
  customer_id: string
  customer_email?: string
  customer_ip: string
  device_fingerprint?: string
  card_last_four?: string
  card_brand?: string
  transaction_type: "purchase" | "refund" | "chargeback" | "withdrawal"
  status: "pending" | "approved" | "declined" | "flagged" | "under_review"
  metadata?: Record<string, any>
  geographic_location?: Record<string, any>
  user_agent?: string
}

export interface FraudSignal {
  id: string
  transaction_id: string
  merchant_id: string
  created_at: string
  signal_type: string
  score: number
  description?: string
  severity: "low" | "medium" | "high" | "critical"
  metadata?: Record<string, any>
}

export interface RiskAssessment {
  id: string
  transaction_id: string
  merchant_id: string
  created_at: string
  overall_risk_score: number
  risk_level: "low" | "medium" | "high" | "critical"
  model_version?: string
  features_used?: Record<string, any>
  prediction_confidence?: number
  is_fraudulent: boolean
  manual_review_flag: boolean
}

export interface Alert {
  id: string
  merchant_id: string
  transaction_id?: string
  created_at: string
  alert_type: string
  severity: "info" | "warning" | "critical"
  title: string
  description?: string
  status: "open" | "acknowledged" | "resolved"
  resolved_at?: string
  metadata?: Record<string, any>
}

export interface EntityList {
  id: string
  merchant_id: string
  created_at: string
  list_type: "whitelist" | "blacklist"
  entity_type: "email" | "ip" | "card" | "customer"
  entity_value: string
  reason?: string
  expires_at?: string
  metadata?: Record<string, any>
}

export interface MLModel {
  id: string
  created_at: string
  model_name: string
  model_version: string
  model_type: string
  performance_metrics?: Record<string, any>
  training_data_size?: number
  accuracy?: number
  precision?: number
  recall?: number
  f1_score?: number
  is_active: boolean
  deployed_at?: string
  metadata?: Record<string, any>
}
