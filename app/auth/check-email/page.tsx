"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CheckEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800 text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
            <CardDescription className="text-slate-400">
              We've sent a verification link to <span className="font-medium text-white">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-slate-300">
              <p className="mb-4">Please check your inbox and click the verification link to complete your registration.</p>
              <p className="text-sm text-slate-400">
                Didn't receive an email? Check your spam folder or request a new verification link below.
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => router.push('/auth/signin')} 
                className="w-full"
              >
                Back to Sign In
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/auth/signup?email=${encodeURIComponent(email)}`}>
                  Resend Verification Email
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
