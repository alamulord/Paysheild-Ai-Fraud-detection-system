import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, business_name } = body

    if (!email || !password || !business_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Note: This would typically be done client-side, but for API route example:
    return NextResponse.json({
      message: "Use client-side auth for signup. This is a placeholder.",
    })
  } catch (error) {
    console.error("[v0] Auth signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
