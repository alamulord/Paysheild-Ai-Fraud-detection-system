"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setIsAuthenticated(true)
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-900">FD</span>
            </div>
            <span className="text-xl font-bold">FraudDetect</span>
          </div>
          <div className="flex gap-4">
            <a href="/auth/login" className="px-4 py-2 text-slate-300 hover:text-white transition">
              Sign In
            </a>
            <a
              href="/auth/signup"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            Real-Time Fraud Detection
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Advanced ML-powered fraud detection system that protects your business with real-time transaction analysis
            and intelligent risk assessment.
          </p>
          <a
            href="/auth/signup"
            className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-emerald-500/50 transition"
          >
            Start Free Trial
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-emerald-500/50 transition">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Analysis</h3>
            <p className="text-slate-400">Instant fraud detection on every transaction with sub-second latency.</p>
          </div>

          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-emerald-500/50 transition">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">ML-Powered</h3>
            <p className="text-slate-400">Machine learning models that learn from your transaction patterns.</p>
          </div>

          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-emerald-500/50 transition">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
            <p className="text-slate-400">Bank-grade encryption and Row-Level Security for your data.</p>
          </div>

          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-emerald-500/50 transition">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-slate-400">Comprehensive dashboards and detailed fraud reports.</p>
          </div>

          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-emerald-500/50 transition">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🔔</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Alerts</h3>
            <p className="text-slate-400">Multi-channel notifications via email, SMS, and webhooks.</p>
          </div>

          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-emerald-500/50 transition">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Integration</h3>
            <p className="text-slate-400">Simple REST APIs for seamless integration with your systems.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-700">
        <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-emerald-500/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Business?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Join thousands of merchants using FraudDetect to prevent fraud and protect their revenue.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/auth/signup"
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition"
            >
              Start Free Trial
            </a>
            <a
              href="/auth/login"
              className="px-8 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500"></div>
              <span className="font-bold">FraudDetect</span>
            </div>
            <p className="text-slate-400 text-sm">© 2025 FraudDetect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
