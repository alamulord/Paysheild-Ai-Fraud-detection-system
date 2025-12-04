"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

function ConfirmEmailContent() {
  const [message, setMessage] = useState("Verifying your email...")
  const [isVerified, setIsVerified] = useState(false)
  const searchParams = useSearchParams()
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'signup' | 'recovery' | 'invite' | null
  const next = searchParams.get('next') ?? '/dashboard'

  useEffect(() => {
    const confirmEmail = async () => {
      const supabase = createClient()
      
      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          type,
          token_hash,
        })

        if (error) {
          setMessage(error.message)
          return
        }
        
        setIsVerified(true)
        setMessage('Email verified successfully! Redirecting to dashboard...')
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = next
        }, 2000)
      }
    }

    confirmEmail()
  }, [token_hash, type, next])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800 text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              {isVerified ? 'Email Verified!' : 'Verifying Email...'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isVerified && (
              <div className="animate-pulse text-slate-400">
                Please wait while we verify your email...
              </div>
            )}
            {isVerified && (
              <div className="text-green-400">
                <p>Your email has been verified successfully!</p>
                <p>Redirecting you to the dashboard...</p>
              </div>
            )}
            <div className="mt-6">
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/signin">Back to Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  )
}
