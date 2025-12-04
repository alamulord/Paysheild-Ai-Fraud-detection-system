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

    const { data: models, error } = await supabase
      .from("ml_models")
      .select("*")
      .eq("is_active", true)
      .order("deployed_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ models })
  } catch (error) {
    console.error("[v0] Fetch models error:", error)
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
    const { model_name, model_type, training_data_config } = body

    if (!model_name || !model_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new model record
    const modelVersion = `${model_type}_${Date.now()}`
    const { data: model, error } = await supabase
      .from("ml_models")
      .insert({
        id: crypto.randomUUID(),
        model_name,
        model_version: modelVersion,
        model_type,
        is_active: false,
        created_at: new Date().toISOString(),
        metadata: { training_config: training_data_config },
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ model, message: "Model created successfully" }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create model error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
