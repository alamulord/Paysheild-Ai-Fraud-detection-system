"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { AlertCircle, LogOut, Menu } from "lucide-react"

interface DashboardLayoutProps {
  user: User
  children: React.ReactNode
}

export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold text-white">Fraud Guard</h1>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-slate-700 rounded">
            <Menu className="w-6 h-6 text-white" />
          </button>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-slate-300 hover:text-white">
              Dashboard
            </Link>
            <Link href="/dashboard/transactions" className="text-slate-300 hover:text-white">
              Transactions
            </Link>
            <Link href="/dashboard/alerts" className="text-slate-300 hover:text-white">
              Alerts
            </Link>
            <Link href="/dashboard/settings" className="text-slate-300 hover:text-white">
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-700 bg-slate-700">
            <div className="px-4 py-2 space-y-2">
              <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-slate-600 text-white">
                Dashboard
              </Link>
              <Link href="/dashboard/transactions" className="block px-3 py-2 rounded hover:bg-slate-600 text-white">
                Transactions
              </Link>
              <Link href="/dashboard/alerts" className="block px-3 py-2 rounded hover:bg-slate-600 text-white">
                Alerts
              </Link>
              <Link href="/dashboard/settings" className="block px-3 py-2 rounded hover:bg-slate-600 text-white">
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-600 text-white"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
