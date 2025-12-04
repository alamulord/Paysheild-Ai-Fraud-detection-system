"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Clock, ArrowUpRight, ArrowDownRight, MoreHorizontal, Clock as ClockIcon } from "lucide-react"
import Link from "next/link"
import { sampleAlerts, sampleTransactions, getSampleData } from "@/lib/sampleData"

// Cache for sample data to prevent regeneration on every render
let cachedSampleData: Record<string, any> = {
  alerts: null,
  transactions: null
};

// Initialize sample data cache
const initializeSampleData = () => {
  if (!cachedSampleData.alerts) {
    cachedSampleData.alerts = getSampleData('alerts');
  }
  if (!cachedSampleData.transactions) {
    cachedSampleData.transactions = getSampleData('transactions');
  }
};

// Ensure sample data is initialized
initializeSampleData();
const fetcher = async (url: string) => {
  const isAlerts = url.includes('/alerts');
  const isTransactions = url.includes('/transactions');
  const cacheKey = isAlerts ? 'alerts' : (isTransactions ? 'transactions' : null);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`API request failed (${res.status}), using sample data`);
      return cacheKey ? cachedSampleData[cacheKey] : { data: [] };
    }
    
    const data = await res.json();
    
    if (cacheKey && data && 
        ((isAlerts && data.alerts?.length > 0) || 
         (isTransactions && data.transactions?.length > 0))) {
      cachedSampleData[cacheKey] = data;
      return data;
    }
    
    return cacheKey ? cachedSampleData[cacheKey] : { data: [] };
    
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name !== 'AbortError') {
      console.error(`Error fetching ${cacheKey || 'data'}, using sample data:`, error);
    } else {
      console.warn(`Request timed out for ${url}, using sample data`);
    }
    return cacheKey ? cachedSampleData[cacheKey] : { data: [] };
  }
};

// const fetcher = async (url: string) => {
//   const isAlerts = url.includes('/alerts');
//   const isTransactions = url.includes('/transactions');
//   const cacheKey = isAlerts ? 'alerts' : (isTransactions ? 'transactions' : null);
  
//   try {
//     const res = await fetch(url, {
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       // Add timeout for the fetch request
//       signal: AbortSignal.timeout(5000)
//     });
    
//     if (!res.ok) {
//       console.warn(`API request failed (${res.status}), using sample data`);
//       return cacheKey ? cachedSampleData[cacheKey] : { data: [] };
//     }
    
//     const data = await res.json();
    
//     // Cache the successful response if it contains valid data
//     if (cacheKey && data && 
//         ((isAlerts && data.alerts?.length > 0) || 
//          (isTransactions && data.transactions?.length > 0))) {
//       cachedSampleData[cacheKey] = data;
//       return data;
//     }
    
//     // Return cached data if response is empty or invalid
//     return cacheKey ? cachedSampleData[cacheKey] : { data: [] };
    
//   } catch (error: any) {
//     if (error?.name !== 'AbortError') {
//       console.error(`Error fetching ${cacheKey || 'data'}, using sample data:`, error);
//     }
//     return cacheKey ? cachedSampleData[cacheKey] : { data: [] };
//   }
// };

interface DashboardOverviewProps {
  merchantId: string
}

const statusStyles = {
  approved: "bg-green-900/50 text-green-200 border-green-800",
  flagged: "bg-red-900/50 text-red-200 border-red-800",
  under_review: "bg-yellow-900/50 text-yellow-200 border-yellow-800",
  declined: "bg-gray-900/50 text-gray-200 border-gray-800",
  default: "bg-blue-900/50 text-blue-200 border-blue-800"
}

// Helper function to calculate stats from transactions
const calculateStats = (transactions: any[]) => {
  if (!transactions || !Array.isArray(transactions)) {
    // Return default values if transactions is not a valid array
    return {
      flaggedTransactions: 0,
      approvedToday: 0,
      pendingReview: 0,
      averageRiskScore: 35
    };
  }

  const flagged = transactions.filter((t: any) => t.status === "flagged").length;
  const approved = transactions.filter((t: any) => t.status === "approved").length;
  const pending = transactions.filter((t: any) => t.status === "under_review").length;
  
  const transactionsWithScores = transactions.filter((t: any) => 
    t && typeof t.risk_score === 'number' && !isNaN(t.risk_score)
  );
  
  const avgRiskScore = transactionsWithScores.length > 0
    ? Math.max(0, Math.min(100, Math.round(
        transactionsWithScores.reduce((sum: number, t: any) => sum + t.risk_score, 0) / 
        transactionsWithScores.length
      )))
    : 35;
  
  return {
    flaggedTransactions: Math.max(0, flagged),
    approvedToday: Math.max(0, approved),
    pendingReview: Math.max(0, pending),
    averageRiskScore: Math.max(0, Math.min(100, avgRiskScore))
  };
};

export default function DashboardOverview({ merchantId }: DashboardOverviewProps) {
  // Fetch data with error handling and fallback to sample data
  const { data: alertsData } = useSWR(
    "/api/alerts?status=open&limit=5", 
    fetcher,
    { 
      refreshInterval: 30000, // Refresh every 30 seconds
      fallbackData: getSampleData('alerts'),
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      dedupingInterval: 10000,
    }
  )
  
  const { data: transactionsData } = useSWR(
    "/api/transactions?limit=5&sort=desc",
    fetcher,
    { 
      refreshInterval: 60000, // Refresh every minute
      fallbackData: getSampleData('transactions'),
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      dedupingInterval: 10000,
    }
  )
  
  const [stats, setStats] = useState(() => {
    // Initialize with default values from sample data
    const txs = cachedSampleData.transactions?.transactions || [];
    return calculateStats(txs);
  });

  // Update stats when transactions data changes
  useEffect(() => {
    // Use transactions from API or fallback to cached sample data
    const txs = transactionsData?.transactions || cachedSampleData.transactions?.transactions || [];
    
    // Always update stats to ensure consistency
    const newStats = calculateStats(txs);
    
    // Only update if values have actually changed
    setStats(prevStats => {
      if (
        prevStats.flaggedTransactions === newStats.flaggedTransactions &&
        prevStats.approvedToday === newStats.approvedToday &&
        prevStats.pendingReview === newStats.pendingReview &&
        prevStats.averageRiskScore === newStats.averageRiskScore
      ) {
        return prevStats;
      }
      return newStats;
    });
  }, [transactionsData]);

  // Format date to relative time (e.g., "2 hours ago")
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    }
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit)
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`
      }
    }
    
    return 'Just now'
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-slate-300">Flagged Today</CardTitle>
              <div className="p-2 rounded-full bg-red-900/30">
                <AlertCircle className="w-4 h-4 text-red-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.flaggedTransactions}</div>
            <p className="text-xs text-slate-400 mt-1">High risk transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-slate-300">Approved</CardTitle>
              <div className="p-2 rounded-full bg-green-900/30">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.approvedToday}</div>
            <p className="text-xs text-slate-400 mt-1">Clean transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-slate-300">Pending Review</CardTitle>
              <div className="p-2 rounded-full bg-yellow-900/30">
                <ClockIcon className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{stats.pendingReview}</div>
            <p className="text-xs text-slate-400 mt-1">Awaiting decision</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-slate-300">Avg Risk Score</CardTitle>
              <div className="p-2 rounded-full bg-blue-900/30">
                <div className="w-4 h-4 text-center text-xs font-bold text-blue-400">{stats.averageRiskScore}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {stats.averageRiskScore < 30 ? 'Low' : stats.averageRiskScore < 70 ? 'Medium' : 'High'}
            </div>
            <p className="text-xs text-slate-400 mt-1">Overall system risk</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="border-b border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">Recent Alerts</CardTitle>
                <CardDescription className="text-slate-400">High priority fraud alerts</CardDescription>
              </div>
              <Link 
                href="/dashboard/alerts" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {alertsData?.alerts?.length > 0 ? (
              <div className="divide-y divide-slate-700">
                {alertsData.alerts.map((alert: any) => (
                  <div 
                    key={alert.id} 
                    className="p-4 hover:bg-slate-700/50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full mt-0.5 ${
                        alert.severity === "critical" 
                          ? "bg-red-900/30 text-red-400" 
                          : "bg-yellow-900/30 text-yellow-400"
                      }`}>
                        {alert.severity === "critical" ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-slate-200 truncate">
                            {alert.title || 'Suspicious Activity Detected'}
                          </h4>
                          <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">
                            {formatTimeAgo(alert.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                          {alert.description || 'No description available'}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full border ${
                            statusStyles[alert.status as keyof typeof statusStyles] || statusStyles.default
                          }`}>
                            {alert.status?.replace('_', ' ')}
                          </span>
                          {alert.transaction_id && (
                            <Link 
                              href={`/dashboard/transactions?search=${alert.transaction_id}`}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              View Transaction
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500">
                <p>No active alerts</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="border-b border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">Recent Transactions</CardTitle>
                <CardDescription className="text-slate-400">Latest payment activities</CardDescription>
              </div>
              <Link 
                href="/dashboard/transactions" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {transactionsData?.transactions?.length > 0 ? (
              <div className="divide-y divide-slate-700">
                {transactionsData.transactions.map((tx: any) => (
                  <div 
                    key={tx.id} 
                    className="p-4 hover:bg-slate-700/50 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full mt-0.5 ${
                          tx.status === 'approved' 
                            ? 'bg-green-900/30 text-green-400' 
                            : tx.status === 'flagged' 
                              ? 'bg-red-900/30 text-red-400' 
                              : 'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {tx.status === 'approved' ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : tx.status === 'flagged' ? (
                            <AlertCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-200">
                            {tx.customer_email || tx.customer_id || 'Unknown Customer'}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {tx.id.slice(0, 8)}...{tx.id.slice(-4)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          tx.status === 'approved' 
                            ? 'text-green-400' 
                            : tx.status === 'flagged' 
                              ? 'text-red-400' 
                              : 'text-yellow-400'
                        }`}>
                          {formatCurrency(tx.amount)}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        statusStyles[tx.status as keyof typeof statusStyles] || statusStyles.default
                      }`}>
                        {tx.status?.replace('_', ' ')}
                      </span>
                      {tx.risk_score !== undefined && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <span>Risk:</span>
                          <span className={`font-medium ${
                            tx.risk_score < 30 
                              ? 'text-green-400' 
                              : tx.risk_score < 70 
                                ? 'text-yellow-400' 
                                : 'text-red-400'
                          }`}>
                            {tx.risk_score}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500">
                <p>No recent transactions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
          <CardDescription className="text-slate-400">Latest transaction activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-2 text-slate-300">Transaction ID</th>
                  <th className="text-left py-2 px-2 text-slate-300">Amount</th>
                  <th className="text-left py-2 px-2 text-slate-300">Status</th>
                  <th className="text-left py-2 px-2 text-slate-300">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {transactionsData?.transactions?.slice(0, 5).map((tx: any) => (
                  <tr key={tx.id} className="border-b border-slate-700 hover:bg-slate-700">
                    <td className="py-2 px-2 text-slate-300 font-mono text-xs">{tx.id.slice(0, 8)}</td>
                    <td className="py-2 px-2 text-slate-300">${tx.amount.toFixed(2)}</td>
                    <td className="py-2 px-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.status === "approved"
                            ? "bg-green-900 text-green-200"
                            : tx.status === "flagged"
                              ? "bg-red-900 text-red-200"
                              : "bg-yellow-900 text-yellow-200"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-300">Medium</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
