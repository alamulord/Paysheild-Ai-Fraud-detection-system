"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface BillingPageProps {
  merchantId: string
}

interface Plan {
  id: string
  name: string
  description: string
  amount: number
  billing_interval: string
  features: string[]
  tier: string
}

export default function BillingPage({ merchantId }: BillingPageProps) {
  const { data: plansData } = useSWR("/api/billing/plans", fetcher)
  const { data: subscriptionData } = useSWR("/api/billing/subscription", fetcher)
  const [isLoading, setIsLoading] = useState(false)

  const plans: Plan[] = plansData?.plans || []
  const currentSubscription = subscriptionData?.subscription

  const handleSelectPlan = async (planId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId }),
      })

      const data = await response.json()
      if (data.session?.url) {
        window.location.href = data.session.url
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Billing & Plans</h1>
        <p className="text-slate-400 mt-1">Manage your subscription and payment methods</p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-white font-medium">{currentSubscription.plan.name}</p>
              <p className="text-slate-400">
                ${currentSubscription.plan.amount} / {currentSubscription.plan.billing_interval}
              </p>
              <p className="text-sm text-slate-500">
                Renews on {new Date(currentSubscription.current_period_end).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`bg-slate-800 border-2 transition ${
              currentSubscription?.plan.id === plan.id ? "border-blue-500" : "border-slate-700 hover:border-slate-600"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-white text-lg">{plan.name}</CardTitle>
              <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-white">
                ${plan.amount}
                <span className="text-lg text-slate-400">/{plan.billing_interval.slice(0, 2)}</span>
              </div>

              <ul className="space-y-2">
                {(plan.features || []).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isLoading || currentSubscription?.plan.id === plan.id}
                className={`w-full ${
                  currentSubscription?.plan.id === plan.id
                    ? "bg-slate-600 text-slate-300 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {currentSubscription?.plan.id === plan.id ? "Current Plan" : "Select Plan"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Billing History */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">No billing history available</div>
        </CardContent>
      </Card>
    </div>
  )
}
