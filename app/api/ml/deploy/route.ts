import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

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
    const { model_id } = body

    if (!model_id) {
      return NextResponse.json({ error: "Missing model_id" }, { status: 400 })
    }

    // Disable all currently active models
    await supabase.from("ml_models").update({ is_active: false }).eq("is_active", true)

    // Activate new model
    const { data: model, error } = await supabase
      .from("ml_models")
      .update({
        is_active: true,
        deployed_at: new Date().toISOString(),
      })
      .eq("id", model_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      model,
      message: "Model deployed successfully",
    })
  } catch (error) {
    console.error("[v0] Model deployment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
