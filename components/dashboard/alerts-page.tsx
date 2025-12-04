"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { getSampleData } from "@/lib/sampleData"

// Cache for sample data
let cachedAlerts: any = null;

const fetcher = async (url: string) => {
  // Initialize cache if not already done
  if (!cachedAlerts) {
    cachedAlerts = getSampleData('alerts');
  }

  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!res.ok) throw new Error('Failed to fetch');
    
    const data = await res.json();
    // Only update cache if we got valid data
    if (data?.alerts?.length) {
      cachedAlerts = data;
      return data;
    }
    
    return cachedAlerts;
  } catch (error) {
    console.error('Error fetching alerts, using sample data:', error);
    return cachedAlerts || getSampleData('alerts');
  }
};

interface AlertsPageProps {
  merchantId: string
}

export default function AlertsPage({ merchantId }: AlertsPageProps) {
  const [statusFilter, setStatusFilter] = useState("open");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: alertsData, mutate, error } = useSWR(
    `/api/alerts?status=${statusFilter}&limit=50`, 
    fetcher,
    {
      fallbackData: getSampleData('alerts'),
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      shouldRetryOnError: true,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      dedupingInterval: 10000,
    }
  );

  // Log errors for debugging
  useEffect(() => {
    if (error) {
      console.error('Alerts fetch error:', error);
    }
  }, [error]);

  // Get alerts from API or fallback to sample data
  const allAlerts = alertsData?.alerts || getSampleData('alerts').alerts || [];
  
  // Apply filters
  const filteredAlerts = allAlerts.filter((alert: any) => {
    // Apply status filter
    const statusMatch = statusFilter === "all" || alert.status === statusFilter;
    // Apply search term filter
    const searchMatch = searchTerm === "" || 
      (alert.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       alert.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       alert.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  const handleResolveAlert = async (alertId: string) => {
    const response = await fetch("/api/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alert_id: alertId, status: "resolved" }),
    })

    if (response.ok) {
      mutate()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Fraud Alerts</h1>
        <p className="text-slate-400 mt-1">Review and manage fraud detection alerts</p>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {["all", "open", "acknowledged", "resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 whitespace-nowrap rounded font-medium transition ${
                    statusFilter === status 
                      ? "bg-blue-600 text-white" 
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {status === "all" ? "All Alerts" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert: any) => (
          <Card key={alert.id} className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {alert.severity === "critical" ? (
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                ) : (
                  <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium">{alert.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{alert.description}</p>
                  <p className="text-slate-500 text-xs mt-2">{new Date(alert.created_at).toLocaleString()}</p>
                </div>
                {alert.status === "open" && (
                  <button
                    onClick={() => handleResolveAlert(alert.id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium flex-shrink-0"
                  >
                    Resolve
                  </button>
                )}
                {alert.status === "resolved" && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredAlerts.length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-8 text-center text-slate-400">No {statusFilter} alerts</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
// "use client"

// import { useState, useEffect, useMemo } from "react"
// import useSWR from "swr"
// import { Card, CardContent } from "@/components/ui/card"
// import { AlertCircle, CheckCircle, Clock } from "lucide-react"
// import { sampleAlerts } from "@/lib/sampleData"

// // Define constant fallback data
// const FALLBACK_ALERTS = {
//   alerts: sampleAlerts,
//   total: sampleAlerts.length,
//   has_more: false
// }

// const fetcher = async (url: string) => {
//   try {
//     const res = await fetch(url, { 
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       next: { revalidate: 0 } // Disable Next.js cache
//     });
    
//     if (!res.ok) {
//       throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
//     }
    
//     const data = await res.json();
//     return data.alerts?.length ? data : FALLBACK_ALERTS;
//   } catch (error) {
//     console.warn('Using fallback alerts data due to error:', error);
//     return FALLBACK_ALERTS;
//   }
// }

// interface AlertsPageProps {
//   merchantId: string
// }

// export default function AlertsPage({ merchantId }: AlertsPageProps) {
//   const [statusFilter, setStatusFilter] = useState("open")
  
//   // Use a stable key to prevent unnecessary refetches
//   const swrKey = useMemo(() => 
//     `/api/alerts?status=${statusFilter}&limit=50`,
//     [statusFilter]
//   );

//   const { data: alertsData } = useSWR(
//     swrKey,
//     fetcher,
//     {
//       fallbackData: FALLBACK_ALERTS,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false,
//       shouldRetryOnError: false,
//     }
//   );

//   // Memoize the alerts to prevent unnecessary re-renders
//   const alerts = useMemo(() => {
//     return alertsData?.alerts || sampleAlerts;
//   }, [alertsData])}
// ... existing imports ...

// Define constant fallback data
// const FALLBACK_ALERTS = {
//   alerts: sampleAlerts,
//   total: sampleAlerts.length,
//   has_more: false
// };

// const fetcher = async (url: string) => {
//   try {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

//     const res = await fetch(url, { 
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       signal: controller.signal,
//       next: { revalidate: 0 }
//     });

//     clearTimeout(timeoutId);

//     if (!res.ok) {
//       if (res.status === 401) {
//         console.warn('Authentication required, using fallback data');
//         return FALLBACK_ALERTS;
//       }
//       throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
//     }
    
//     const data = await res.json();
//     return data.alerts?.length ? data : FALLBACK_ALERTS;
//   } catch (error) {
//     if (error.name === 'AbortError') {
//       console.warn('Request timed out, using fallback data');
//     } else {
//       console.warn('Error fetching alerts, using fallback data:', error);
//     }
//     return FALLBACK_ALERTS;
//   }
// };

// export default function AlertsPage({ merchantId }: AlertsPageProps) {
//   const [statusFilter, setStatusFilter] = useState("open");
//   const [isLoading, setIsLoading] = useState(true);
  
//   const { data: alertsData, error } = useSWR(
//     `/api/alerts?status=${statusFilter}&limit=50`,
//     fetcher,
//     {
//       fallbackData: FALLBACK_ALERTS,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false,
//       shouldRetryOnError: false,
//       onErrorRetry: (error) => {
//         // Don't retry on auth errors or timeouts
//         if (error.status === 401 || error.name === 'AbortError') return;
//       },
//     }
//   );

//   const alerts = useMemo(() => {
//     return alertsData?.alerts || sampleAlerts;
//   }, [alertsData]);

//   // ... rest of your component code ...

//   const formatTime = (dateString: string) => {
//   const date = new Date(dateString);
//   return date.toLocaleTimeString([], { 
//     hour: '2-digit', 
//     minute: '2-digit',
//     hour12: true 
//   });
// };
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-white">Fraud Alerts</h1>
//         <p className="text-slate-400 mt-1">Review and manage fraud detection alerts</p>
//       </div>
//       {/* ... rest of your JSX ... */}
//       <div className="text-xs text-slate-500">
//   {typeof window !== 'undefined' ? formatTime(tx.created_at) : ''}
// </div>
//     </div>
//   );
// }