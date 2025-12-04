// // import { createClient } from "@/lib/supabase/server"
// // import { NextResponse } from "next/server"

// // export interface NotificationPreferences {
// //   email_alerts: boolean
// //   webhook_alerts: boolean
// //   sms_alerts: boolean
// //   alert_threshold: number
// //   notify_on_critical: boolean
// //   notify_on_high: boolean
// //   notify_on_medium: boolean
// //   email_recipients: string[]
// //   webhook_url?: string
// //   merchant_id: string
// // }

// // const DEFAULT_PREFERENCES: Omit<NotificationPreferences, 'merchant_id' | 'webhook_url'> = {
// //   email_alerts: true,
// //   webhook_alerts: false,
// //   sms_alerts: false,
// //   notify_on_critical: true,
// //   notify_on_high: true,
// //   notify_on_medium: false,
// //   email_recipients: [],
// //   alert_threshold: 50
// // }

// // export async function GET() {
// //   try {
// //     const supabase = createClient()
    
// //     // Get the current user
// //     const { data: { user }, error: userError } = await supabase.auth.getUser()
    
// //     if (userError || !user) {
// //       return NextResponse.json(
// //         { error: "Unauthorized - Please log in" },
// //         { status: 401 }
// //       )
// //     }

// //     // Get the user's preferences
// //     const { data: preferences, error } = await supabase
// //       .from('notification_preferences')
// //       .select('*')
// //       .eq('merchant_id', user.id)
// //       .single()

// //     // Handle "no rows" error specifically
// //     if (error && error.code !== 'PGRST116') {
// //       console.error('Error fetching preferences:', error)
// //       return NextResponse.json(
// //         { error: "Failed to fetch notification preferences" },
// //         { status: 500 }
// //       )
// //     }

// //     // Return default preferences if none exist
// //     if (!preferences) {
// //       return NextResponse.json({
// //         preferences: {
// //           ...DEFAULT_PREFERENCES,
// //           merchant_id: user.id
// //         }
// //       })
// //     }

// //     // Map database fields to expected response format
// //     const responseData: NotificationPreferences = {
// //       email_alerts: preferences.email_alerts ?? DEFAULT_PREFERENCES.email_alerts,
// //       webhook_alerts: preferences.webhook_alerts ?? DEFAULT_PREFERENCES.webhook_alerts,
// //       sms_alerts: preferences.sms_alerts ?? DEFAULT_PREFERENCES.sms_alerts,
// //       notify_on_critical: preferences.notify_on_critical ?? DEFAULT_PREFERENCES.notify_on_critical,
// //       notify_on_high: preferences.notify_on_high ?? DEFAULT_PREFERENCES.notify_on_high,
// //       notify_on_medium: preferences.notify_on_medium ?? DEFAULT_PREFERENCES.notify_on_medium,
// //       email_recipients: Array.isArray(preferences.email_recipients) 
// //         ? preferences.email_recipients 
// //         : [],
// //       webhook_url: preferences.webhook_url || undefined,
// //       alert_threshold: preferences.alert_threshold ?? DEFAULT_PREFERENCES.alert_threshold,
// //       merchant_id: user.id
// //     }

// //     return NextResponse.json({ preferences: responseData })
// //   } catch (error) {
// //     console.error('Error in GET /api/notifications/preferences:', error)
// //     return NextResponse.json(
// //       { error: "Internal server error" },
// //       { status: 500 }
// //     )
// //   }
// // }

// // export async function POST(request: Request) {
// //   try {
// //     const supabase = createClient()
    
// //     // Get the current user
// //     const { data: { user }, error: userError } = await supabase.auth.getUser()
    
// //     if (userError || !user) {
// //       return NextResponse.json(
// //         { error: "Unauthorized - Please log in" },
// //         { status: 401 }
// //       )
// //     }

// //     const updates = await request.json()

// //     // Validate and sanitize updates
// //     const validUpdates = {
// //       email_alerts: typeof updates.email_alerts === 'boolean' 
// //         ? updates.email_alerts 
// //         : DEFAULT_PREFERENCES.email_alerts,
// //       webhook_alerts: typeof updates.webhook_alerts === 'boolean' 
// //         ? updates.webhook_alerts 
// //         : DEFAULT_PREFERENCES.webhook_alerts,
// //       sms_alerts: typeof updates.sms_alerts === 'boolean' 
// //         ? updates.sms_alerts 
// //         : DEFAULT_PREFERENCES.sms_alerts,
// //       notify_on_critical: typeof updates.notify_on_critical === 'boolean' 
// //         ? updates.notify_on_critical 
// //         : DEFAULT_PREFERENCES.notify_on_critical,
// //       notify_on_high: typeof updates.notify_on_high === 'boolean' 
// //         ? updates.notify_on_high 
// //         : DEFAULT_PREFERENCES.notify_on_high,
// //       notify_on_medium: typeof updates.notify_on_medium === 'boolean' 
// //         ? updates.notify_on_medium 
// //         : DEFAULT_PREFERENCES.notify_on_medium,
// //       email_recipients: Array.isArray(updates.email_recipients) 
// //         ? updates.email_recipients.filter((email: string) => 
// //             typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
// //           )
// //         : [],
// //       webhook_url: typeof updates.webhook_url === 'string' ? updates.webhook_url : null,
// //       alert_threshold: typeof updates.alert_threshold === 'number' && 
// //                        updates.alert_threshold >= 0 && 
// //                        updates.alert_threshold <= 100 
// //                        ? updates.alert_threshold 
// //                        : DEFAULT_PREFERENCES.alert_threshold,
// //       merchant_id: user.id
// //     }

// //     // Prepare the database payload
// //     const dbPayload = {
// //       merchant_id: validUpdates.merchant_id,
// //       email_alerts: validUpdates.email_alerts,
// //       webhook_alerts: validUpdates.webhook_alerts,
// //       sms_alerts: validUpdates.sms_alerts,
// //       notify_on_critical: validUpdates.notify_on_critical,
// //       notify_on_high: validUpdates.notify_on_high,
// //       notify_on_medium: validUpdates.notify_on_medium,
// //       email_recipients: validUpdates.email_recipients,
// //       webhook_url: validUpdates.webhook_url,
// //       alert_threshold: validUpdates.alert_threshold,
// //       updated_at: new Date().toISOString()
// //     }

// //     // Upsert the preferences
// //     const { data, error } = await supabase
// //       .from('notification_preferences')
// //       .upsert(dbPayload, {
// //         onConflict: 'merchant_id'
// //       })
// //       .select()
// //       .single()

// //     if (error) {
// //       console.error('Database error:', error)
// //       throw error
// //     }

// //     // Return the updated preferences in the expected format
// //     return NextResponse.json({ 
// //       preferences: {
// //         email_alerts: data.email_alerts,
// //         webhook_alerts: data.webhook_alerts,
// //         sms_alerts: data.sms_alerts,
// //         notify_on_critical: data.notify_on_critical,
// //         notify_on_high: data.notify_on_high,
// //         notify_on_medium: data.notify_on_medium,
// //         email_recipients: data.email_recipients || [],
// //         webhook_url: data.webhook_url || undefined,
// //         alert_threshold: data.alert_threshold,
// //         merchant_id: data.merchant_id
// //       },
// //       message: "Preferences updated successfully"
// //     })

// //   } catch (error) {
// //     console.error('Error in POST /api/notifications/preferences:', error)
// //     return NextResponse.json(
// //       { 
// //         error: "Failed to update notification preferences",
// //         details: error instanceof Error ? error.message : 'Unknown error'
// //       },
// //       { status: 500 }
// //     )
// //   }
// // }
// // import { createClient } from "@/lib/supabase/server"
// // import { NextResponse } from "next/server"

// // interface DatabaseNotificationPreferences {
// //   id: string
// //   merchant_id: string
// //   email_alerts: boolean
// //   webhook_alerts: boolean
// //   sms_alerts: boolean
// //   alert_threshold: number
// //   notify_on_critical: boolean
// //   notify_on_high: boolean
// //   notify_on_medium: boolean
// //   email_recipients: string[]
// //   webhook_url: string | null
// //   created_at: string
// //   updated_at: string
// // }

// // export interface NotificationPreferences {
// //   email_alerts: boolean
// //   webhook_alerts: boolean
// //   sms_alerts: boolean
// //   alert_threshold: number
// //   notify_on_critical: boolean
// //   notify_on_high: boolean
// //   notify_on_medium: boolean
// //   email_recipients: string[]
// //   webhook_url?: string
// //   merchant_id: string
// // }

// // const DEFAULT_PREFERENCES: Omit<NotificationPreferences, 'merchant_id' | 'webhook_url'> = {
// //   email_alerts: true,
// //   webhook_alerts: false,
// //   sms_alerts: false,
// //   notify_on_critical: true,
// //   notify_on_high: true,
// //   notify_on_medium: false,
// //   email_recipients: [],
// //   alert_threshold: 50
// // }

// // export async function GET() {
// //   const supabase = createClient()
  
// //   try {
// //     // Get the current user
// //     const { data: { user }, error: userError } = await supabase.auth.getUser()
    
// //     if (userError || !user) {
// //       return NextResponse.json(
// //         { error: "Unauthorized - Please log in" },
// //         { status: 401 }
// //       )
// //     }

// //     // Get the user's preferences
// //     const { data: preferences, error } = await supabase
// //       .from('notification_preferences')
// //       .select('*')
// //       .eq('merchant_id', user.id)
// //       .single<DatabaseNotificationPreferences>()

// //     // Handle "no rows" error specifically
// //     if (error && error.code !== 'PGRST116') {
// //       console.error('Error fetching preferences:', error)
// //       return NextResponse.json(
// //         { error: "Failed to fetch notification preferences" },
// //         { status: 500 }
// //       )
// //     }

// //     // Return default preferences if none exist
// //     if (!preferences) {
// //       return NextResponse.json({
// //         preferences: {
// //           ...DEFAULT_PREFERENCES,
// //           merchant_id: user.id
// //         }
// //       })
// //     }

// //     // Map database fields to expected response format
// //     const responseData: NotificationPreferences = {
// //       email_alerts: preferences.email_alerts,
// //       webhook_alerts: preferences.webhook_alerts,
// //       sms_alerts: preferences.sms_alerts,
// //       notify_on_critical: preferences.notify_on_critical,
// //       notify_on_high: preferences.notify_on_high,
// //       notify_on_medium: preferences.notify_on_medium,
// //       email_recipients: preferences.email_recipients || [],
// //       webhook_url: preferences.webhook_url || undefined,
// //       alert_threshold: preferences.alert_threshold,
// //       merchant_id: preferences.merchant_id
// //     }

// //     return NextResponse.json({ preferences: responseData })
// //   } catch (error) {
// //     console.error('Error in GET /api/notifications/preferences:', error)
// //     return NextResponse.json(
// //       { 
// //         error: "Internal server error",
// //         details: error instanceof Error ? error.message : 'Unknown error'
// //       },
// //       { status: 500 }
// //     )
// //   }
// // }

// // export async function POST(request: Request) {
// //   const supabase = createClient()
  
// //   try {
// //     // Get the current user
// //     const { data: { user }, error: userError } = await supabase.auth.getUser()
    
// //     if (userError || !user) {
// //       return NextResponse.json(
// //         { error: "Unauthorized - Please log in" },
// //         { status: 401 }
// //       )
// //     }

// //     const updates = await request.json()

// //     // Validate and sanitize updates
// //     const validUpdates = {
// //       email_alerts: typeof updates.email_alerts === 'boolean' 
// //         ? updates.email_alerts 
// //         : DEFAULT_PREFERENCES.email_alerts,
// //       webhook_alerts: typeof updates.webhook_alerts === 'boolean' 
// //         ? updates.webhook_alerts 
// //         : DEFAULT_PREFERENCES.webhook_alerts,
// //       sms_alerts: typeof updates.sms_alerts === 'boolean' 
// //         ? updates.sms_alerts 
// //         : DEFAULT_PREFERENCES.sms_alerts,
// //       notify_on_critical: typeof updates.notify_on_critical === 'boolean' 
// //         ? updates.notify_on_critical 
// //         : DEFAULT_PREFERENCES.notify_on_critical,
// //       notify_on_high: typeof updates.notify_on_high === 'boolean' 
// //         ? updates.notify_on_high 
// //         : DEFAULT_PREFERENCES.notify_on_high,
// //       notify_on_medium: typeof updates.notify_on_medium === 'boolean' 
// //         ? updates.notify_on_medium 
// //         : DEFAULT_PREFERENCES.notify_on_medium,
// //       email_recipients: Array.isArray(updates.email_recipients) 
// //         ? updates.email_recipients.filter((email: unknown) => 
// //             typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
// //           )
// //         : [],
// //       webhook_url: typeof updates.webhook_url === 'string' ? updates.webhook_url : null,
// //       alert_threshold: typeof updates.alert_threshold === 'number' && 
// //                       updates.alert_threshold >= 0 && 
// //                       updates.alert_threshold <= 100 
// //                       ? updates.alert_threshold 
// //                       : DEFAULT_PREFERENCES.alert_threshold
// //     }

// //     // Prepare the database payload
// //     const dbPayload = {
// //       merchant_id: user.id,
// //       ...validUpdates,
// //       updated_at: new Date().toISOString()
// //     }

// //     // Upsert the preferences
// //     const { data, error } = await supabase
// //       .from('notification_preferences')
// //       .upsert(dbPayload, {
// //         onConflict: 'merchant_id'
// //       })
// //       .select()
// //       .single<DatabaseNotificationPreferences>()

// //     if (error) {
// //       console.error('Database error:', error)
// //       throw error
// //     }

// //     // Map the response to the expected format
// //     const responseData: NotificationPreferences = {
// //       email_alerts: data.email_alerts,
// //       webhook_alerts: data.webhook_alerts,
// //       sms_alerts: data.sms_alerts,
// //       notify_on_critical: data.notify_on_critical,
// //       notify_on_high: data.notify_on_high,
// //       notify_on_medium: data.notify_on_medium,
// //       email_recipients: data.email_recipients || [],
// //       webhook_url: data.webhook_url || undefined,
// //       alert_threshold: data.alert_threshold,
// //       merchant_id: data.merchant_id
// //     }

// //     return NextResponse.json({ 
// //       preferences: responseData,
// //       message: "Preferences updated successfully"
// //     })

// //   } catch (error) {
// //     console.error('Error in POST /api/notifications/preferences:', error)
// //     return NextResponse.json(
// //       { 
// //         error: "Failed to update notification preferences",
// //         details: error instanceof Error ? error.message : 'Unknown error'
// //       },
// //       { status: 500 }
// //     )
// //   }
// // }

// import { createClient } from "@/lib/supabase/server"
// import { NextResponse } from "next/server"
// import { z } from "zod"

// // Schema for validating notification preferences
// const NotificationPreferencesSchema = z.object({
//   email_alerts: z.boolean().default(true),
//   webhook_alerts: z.boolean().default(false),
//   sms_alerts: z.boolean().default(false),
//   alert_threshold: z.number().min(0).max(100).default(50),
//   notify_on_critical: z.boolean().default(true),
//   notify_on_high: z.boolean().default(true),
//   notify_on_medium: z.boolean().default(false),
//   email_recipients: z.array(z.string().email()).default([]),
//   webhook_url: z.string().url().or(z.literal('')).optional(),
// })

// type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema> & {
//   merchant_id: string
// }

// // Rate limiting configuration
// const RATE_LIMIT = {
//   WINDOW_MS: 15 * 60 * 1000, // 15 minutes
//   MAX_REQUESTS: 100,
// }

// // Simple in-memory rate limiter (consider using Redis in production)
// const rateLimit = new Map<string, { count: number; resetAt: number }>()

// function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
//   const now = Date.now()
//   const rateLimitData = rateLimit.get(ip) || { count: 0, resetAt: now + RATE_LIMIT.WINDOW_MS }
  
//   if (now > rateLimitData.resetAt) {
//     rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT.WINDOW_MS })
//     return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - 1 }
//   }

//   if (rateLimitData.count >= RATE_LIMIT.MAX_REQUESTS) {
//     return { allowed: false, remaining: 0 }
//   }

//   rateLimit.set(ip, { ...rateLimitData, count: rateLimitData.count + 1 })
//   return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - rateLimitData.count - 1 }
// }

// export async function GET(request: Request) {
//   const supabase = createClient()
//   const ip = request.headers.get('x-forwarded-for') || 'unknown'

//   try {
//     // Rate limiting
//     const rateLimitCheck = checkRateLimit(ip)
//     if (!rateLimitCheck.allowed) {
//       return NextResponse.json(
//         { error: "Too many requests" },
//         { 
//           status: 429,
//           headers: {
//             'Retry-After': '900', // 15 minutes in seconds
//             'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
//             'X-RateLimit-Remaining': '0',
//             'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + 900).toString()
//           }
//         }
//       )
//     }

//     // Get the current user
//     const { data: { user }, error: userError } = await supabase.auth.getUser()
    
//     if (userError || !user) {
//       return NextResponse.json(
//         { error: "Unauthorized - Please log in" },
//         { 
//           status: 401,
//           headers: {
//             'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
//             'X-RateLimit-Remaining': rateLimitCheck.remaining.toString()
//           }
//         }
//       )
//     }

//     // Get the user's preferences
//     const { data: preferences, error } = await supabase
//       .from('notification_preferences')
//       .select('*')
//       .eq('merchant_id', user.id)
//       .single()

//     // Handle "no rows" error specifically
//     if (error && error.code !== 'PGRST116') {
//       console.error('Error fetching preferences:', error)
//       return NextResponse.json(
//         { 
//           error: "Failed to fetch notification preferences",
//           details: error.message
//         },
//         { 
//           status: 500,
//           headers: {
//             'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
//             'X-RateLimit-Remaining': rateLimitCheck.remaining.toString()
//           }
//         }
//       )
//     }

//     // Return default preferences if none exist
//     if (!preferences) {
//       return NextResponse.json(
//         {
//           preferences: {
//             ...NotificationPreferencesSchema.parse({}),
//             merchant_id: user.id
//           }
//         },
//         {
//           headers: {
//             'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
//             'X-RateLimit-Remaining': rateLimitCheck.remaining.toString()
//           }
//         }
//       )
//     }

//     // Map database fields to expected response format
//     const responseData = NotificationPreferencesSchema.parse(preferences)
//     responseData.merchant_id = user.id

//     return NextResponse.json(
//       { preferences: responseData },
//       {
//         headers: {
//           'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
//           'X-RateLimit-Remaining': rateLimitCheck.remaining.toString()
//         }
//       }
//     )
//   } catch (error) {
//     console.error('Error in GET /api/notifications/preferences:', error)
//     return NextResponse.json(
//       { 
//         error: "Internal server error",
//         details: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     )
//   }
// }

// export async function POST(request: Request) {
//   const supabase = createClient()
//   const ip = request.headers.get('x-forwarded-for') || 'unknown'

//   try {
//     // Rate limiting
//     const rateLimitCheck = checkRateLimit(ip)
//     if (!rateLimitCheck.allowed) {
//       return NextResponse.json(
//         { error: "Too many requests" },
//         { 
//           status: 429,
//           headers: {
//             'Retry-After': '900',
//             'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
//             'X-RateLimit-Remaining': '0',
//             'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + 900).toString()
//           }
//         }
//       )
//     }

//     // Get the current user
//     const { data: { user }, error: userError } = await supabase.auth.getUser()
    
//     if (userError || !user) {
//       return NextResponse.json(
//         { error: "Unauthorized - Please log in" },
//         { 
//           status: 401,
//           headers: {
//             'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
//             'X-RateLimit-Remaining': rateLimitCheck.remaining.toString()
//           }
//         }
//       )
//     }

//     // Parse and validate request body
//     let updates;
//     try {
//       updates = await request.json()
//     } catch (e) {
//       return NextResponse.json(
//         { error: "Invalid JSON payload" },
//         { 
//           status: 400,
//           headers: {
//             'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
//             'X-RateLimit-Remaining': rateLimitCheck.remaining.toString()
//           }
//         }
//       )
//     }

//     // Validate and sanitize updates
//     const validatedData = NotificationPreferencesSchema.parse(updates)

//     // Prepare the database payload
//     const dbPayload = {
//       merchant_id: user.id,
//       ...validatedData,
//       updated_at: new Date().toISOString()
//     }

//     // Upsert the preferences
//     const { data, error } = await supabase
//       .from('notification_preferences')
//       .upsert(dbPayload, {
//         onConflict: 'merchant_id'
//       })
//       .select()
//       .single()

//     if (error) {
//       console.error('Database error:', error)
//       throw error
//     }

//     // Return the updated preferences
//     return NextResponse.json(
//       { 
//         preferences: NotificationPreferencesSchema.parse(data),
//         message: "Preferences updated successfully"
//       },
//       {
//         status: 200,
//         headers: {
//           'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
//           'X-RateLimit-Remaining': (rateLimitCheck.remaining - 1).toString()
//         }
//       }
//     )

//   } catch (error) {
//     console.error('Error in POST /api/notifications/preferences:', error)
    
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { 
//           error: "Validation error",
//           details: error.errors,
//           message: "Invalid notification preferences data"
//         },
//         { status: 400 }
//       )
//     }

//     return NextResponse.json(
//       { 
//         error: "Failed to update notification preferences",
//         details: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     )
//   }
// }