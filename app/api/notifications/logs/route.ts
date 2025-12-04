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

    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const {
      data: logs,
      count,
      error,
    } = await supabase
      .from("notification_logs")
      .select("*", { count: "exact" })
      .eq("merchant_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      logs,
      total: count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("[v0] Fetch notification logs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
