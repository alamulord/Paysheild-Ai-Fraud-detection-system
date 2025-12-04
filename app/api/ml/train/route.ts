import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { trainMLModel } from "@/lib/ml-service"

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
    const { model_id, training_days = 90 } = body

    if (!model_id) {
      return NextResponse.json({ error: "Missing model_id" }, { status: 400 })
    }

    // Fetch model
    const { data: model, error: modelError } = await supabase.from("ml_models").select("*").eq("id", model_id).single()

    if (modelError || !model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    // Train model with historical data
    const result = await trainMLModel(supabase, model, training_days)

    // Update model with metrics
    const { error: updateError } = await supabase
      .from("ml_models")
      .update({
        performance_metrics: result.metrics,
        accuracy: result.accuracy,
        precision: result.precision,
        recall: result.recall,
        f1_score: result.f1_score,
        training_data_size: result.training_samples,
        metadata: {
          ...model.metadata,
          training_completed_at: new Date().toISOString(),
          training_duration_ms: result.training_duration,
        },
      })
      .eq("id", model_id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      model_id,
      status: "training_completed",
      metrics: result.metrics,
      accuracy: result.accuracy,
      precision: result.precision,
      recall: result.recall,
      f1_score: result.f1_score,
    })
  } catch (error) {
    console.error("[v0] Model training error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
