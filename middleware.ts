import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
}
// middleware.ts
// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   const res = NextResponse.next()
//   const supabase = createMiddlewareClient({ req: request, res })

//   const { data: { session } } = await supabase.auth.getSession()

//   if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
//     const redirectUrl = request.nextUrl.clone()
//     redirectUrl.pathname = '/auth/login'
//     redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
//     return NextResponse.redirect(redirectUrl)
//   }

//   return res
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/settings'],
// }