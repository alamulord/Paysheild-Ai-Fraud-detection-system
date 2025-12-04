// app/not-found.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700/50">
            <AlertTriangle className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-5xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-slate-200">Page Not Found</h2>
          <p className="text-slate-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              Go to Dashboard
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-slate-800 mt-8">
          <p className="text-sm text-slate-500">
            Need help?{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-400 hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}