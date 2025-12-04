import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check database connection
    const { error } = await supabase.from("merchants").select("id").limit(1)

    if (error) {
      return NextResponse.json({ status: "unhealthy", error: "Database connection failed" }, { status: 503 })
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    return NextResponse.json({ status: "unhealthy", error: "Health check failed" }, { status: 503 })
  }
}
