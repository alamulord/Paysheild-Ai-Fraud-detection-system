import { NextResponse } from "next/server"

// Simple metrics collector
const metrics = {
  requests: 0,
  errors: 0,
  fraud_detections: 0,
  transactions_processed: 0,
}

export async function GET() {
  const prometheusMetrics = `
# HELP fraud_detection_requests_total Total requests processed
# TYPE fraud_detection_requests_total counter
fraud_detection_requests_total ${metrics.requests}

# HELP fraud_detection_errors_total Total errors
# TYPE fraud_detection_errors_total counter
fraud_detection_errors_total ${metrics.errors}

# HELP fraud_detection_frauds_total Total fraud detections
# TYPE fraud_detection_frauds_total counter
fraud_detection_frauds_total ${metrics.fraud_detections}

# HELP fraud_detection_transactions_total Total transactions processed
# TYPE fraud_detection_transactions_total counter
fraud_detection_transactions_total ${metrics.transactions_processed}

# HELP fraud_detection_uptime_seconds Application uptime in seconds
# TYPE fraud_detection_uptime_seconds gauge
fraud_detection_uptime_seconds ${process.uptime()}
  `.trim()

  return new NextResponse(prometheusMetrics, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}

export function incrementRequestCount() {
  metrics.requests++
}

export function incrementErrorCount() {
  metrics.errors++
}

export function incrementFraudCount() {
  metrics.fraud_detections++
}

export function incrementTransactionCount() {
  metrics.transactions_processed++
}
