"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TrendingDown, TrendingUp } from "lucide-react"
import { getSampleData } from "@/lib/sampleData"

// Cache for sample data
let cachedTransactions: any = null;

const fetcher = async (url: string) => {
  // Initialize cache if not already done
  if (!cachedTransactions) {
    cachedTransactions = getSampleData('transactions');
  }

  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!res.ok) throw new Error('Failed to fetch');
    
    const data = await res.json();
    // Only update cache if we got valid data
    if (data?.transactions?.length) {
      cachedTransactions = data;
      return data;
    }
    
    return cachedTransactions;
  } catch (error) {
    console.error('Error fetching transactions, using sample data:', error);
    return cachedTransactions || getSampleData('transactions');
  }
};

interface TransactionsPageProps {
  merchantId: string
}

export default function TransactionsPage({ merchantId }: TransactionsPageProps) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { data: transactionsData } = useSWR(
    `/api/transactions?status=${statusFilter !== "all" ? statusFilter : ""}&limit=50`,
    fetcher,
    {
      fallbackData: getSampleData('transactions'),
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
    }
  )

  // Get transactions from API or fallback to sample data
  const transactions = transactionsData?.transactions || getSampleData('transactions').transactions || [];
  
  // Apply filters
  const filteredTransactions = transactions.filter((tx: any) => {
    // Apply status filter
    const statusMatch = statusFilter === "all" || tx.status === statusFilter;
    // Apply search term filter
    const searchMatch = searchTerm === "" || 
      (tx.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       tx.customer_id?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Transactions</h1>
        <p className="text-slate-400 mt-1">Monitor all transaction activity</p>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by email or customer ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="flagged">Flagged</option>
              <option value="under_review">Under Review</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Transaction ID</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Risk Level</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx: any) => (
                  <tr key={tx.id} className="border-b border-slate-700 hover:bg-slate-700 transition">
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">{tx.id.slice(0, 12)}</td>
                    <td className="py-3 px-4 text-slate-300">{tx.customer_email || tx.customer_id}</td>
                    <td className="py-3 px-4 text-slate-300 font-medium">${tx.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.status === "approved"
                            ? "bg-green-900 text-green-200"
                            : tx.status === "flagged"
                              ? "bg-red-900 text-red-200"
                              : tx.status === "under_review"
                                ? "bg-yellow-900 text-yellow-200"
                                : "bg-gray-900 text-gray-200"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div className="flex items-center gap-1">
                        {tx.status === "flagged" ? (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        )}
                        <span>{tx.status === "flagged" ? "High" : "Low"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{new Date(tx.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-slate-400">No transactions found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
