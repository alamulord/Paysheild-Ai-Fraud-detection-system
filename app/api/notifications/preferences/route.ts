// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export const dynamic = 'force-dynamic'

// export async function GET() {
//   const supabase = createRouteHandlerClient({ cookies })
//   const { data: { session } } = await supabase.auth.getSession()

//   if (!session) {
//     return new NextResponse(JSON.stringify({ error: 'Not authorized' }), {
//       status: 401,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   }

//   return new NextResponse(JSON.stringify({ message: 'Success' }), {
//     status: 200,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
// }

// export async function POST(request: NextRequest) {
//   const supabase = createRouteHandlerClient({ cookies })
//   const { data: { session } } = await supabase.auth.getSession()

//   if (!session) {
//     return new NextResponse(JSON.stringify({ error: 'Not authorized' }), {
//       status: 401,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   }

//   try {
//     const body = await request.json()
//     // Add your notification preferences handling logic here
//     return new NextResponse(JSON.stringify({ success: true }), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ error: 'Invalid request' }), {
//       status: 400,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   }
// }
// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export const dynamic = 'force-dynamic'

// export async function GET() {
//   const cookieStore = cookies()
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name) {
//           return cookieStore.get(name)?.value
//         },
//         set(name, value, options) {
//           cookieStore.set({ name, value, ...options })
//         },
//         remove(name, options) {
//           cookieStore.set({ name, value: '', ...options })
//         },
//       },
//     }
//   )
//   const { data: { session } } = await supabase.auth.getSession()

//   if (!session) {
//     return new NextResponse(JSON.stringify({ error: 'Not authorized' }), {
//       status: 401,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   }

//   return new NextResponse(JSON.stringify({ message: 'Success' }), {
//     status: 200,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
// }

// export async function POST(request: NextRequest) {
//   const cookieStore = cookies()
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name) {
//           return cookieStore.get(name)?.value
//         },
//         set(name, value, options) {
//           cookieStore.set({ name, value, ...options })
//         },
//         remove(name, options) {
//           cookieStore.set({ name, value: '', ...options })
//         },
//       },
//     }
//   )
//   const { data: { session } } = await supabase.auth.getSession()

//   if (!session) {
//     return new NextResponse(JSON.stringify({ error: 'Not authorized' }), {
//       status: 401,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   }

//   try {
//     const body = await request.json()
//     // Add your notification preferences handling logic here
//     return new NextResponse(JSON.stringify({ success: true }), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ error: 'Invalid request' }), {
//       status: 400,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   }
// }

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Not authorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new NextResponse(JSON.stringify({ message: 'Success' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Not authorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  try {
    const body = await request.json()
    // Add your notification preferences handling logic here
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export const dynamic = 'force-dynamic'

// export async function GET() {
//   const cookieStore = cookies()
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name) {
//           return cookieStore.get(name)?.value
//         },
//         set(name, value, options) {
//           cookieStore.set({ name, value, ...options })
//         },
//         remove(name, options) {
//           cookieStore.set({ name, value: '', ...options })
//         },
//       },
//     }
//   )
  
//   const { data: { session } } = await supabase.auth.getSession()

//   if (!session) {
//     return new NextResponse(JSON.stringify({ error: 'Not authorized' }), {
//       status: 401,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   }

//   return new NextResponse(JSON.stringify({ message: 'Success' }), {
//     status: 200,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
// }

// export async function POST(request: NextRequest) {
//   const cookieStore = cookies()
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name) {
//           return cookieStore.get(name)?.value
//         },
//         set(name, value, options) {
//           cookieStore.set({ name, value, ...options })
//         },
//         remove(name, options) {
//           cookieStore.set({ name, value: '', ...options })
//         },
//       },
//     }
//   )
  
//   const { data: { session } } = await supabase.auth.getSession()

//   if (!session) {
//     return new NextResponse(JSON.stringify({ error: 'Not authorized' }), {
//       status: 401,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   }

//   try {
//     const body = await request.json()
//     // Add your notification preferences handling logic here
//     return new NextResponse(JSON.stringify({ success: true }), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ error: 'Invalid request' }), {
//       status: 400,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//   }
// }