// // "use client"

// // components/dashboard/settings-page.tsx
// // "use client"

// // import { useState, useEffect } from "react"
// // import useSWR from "swr"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Bell, Save, CheckCircle, XCircle } from "lucide-react"
// // import { toast } from "@/components/ui/use-toast"

// // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // interface SettingsPageProps {
// //   merchantId: string
// // }

// // export default function SettingsPage({ merchantId }: SettingsPageProps) {
// //   const { data: prefsData, mutate } = useSWR(
// //     "/api/notifications/preferences",
// //     fetcher,
// //     {
// //       revalidateOnFocus: false,
// //       onError: (error) => {
// //         toast({
// //           title: "Error loading settings",
// //           description: "Failed to load your notification preferences",
// //           variant: "destructive",
// //         })
// //       }
// //     }
// //   )

// //   const [isSaving, setIsSaving] = useState(false)
// //   const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
// //   const [formData, setFormData] = useState({
// //     email_alerts: true,
// //     webhook_alerts: false,
// //     sms_alerts: false,
// //     notify_on_critical: true,
// //     notify_on_high: true,
// //     notify_on_medium: false,
// //     email_recipients: [] as string[],
// //     webhook_url: "",
// //     alert_threshold: 50,
// //   })

// //   // Initialize form with fetched data
// //   useEffect(() => {
// //     if (prefsData?.preferences) {
// //       setFormData(prefsData.preferences)
// //     }
// //   }, [prefsData])
// //   const handleSave = async () => {
// //   setIsSaving(true);
// //   setSaveStatus("idle");
  
// //   try {
// //     const response = await fetch("/api/notifications/preferences", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(formData),
// //     });

// //     const result = await response.json().catch(() => ({}));

// //     if (!response.ok) {
// //       throw new Error(
// //         result.details || 
// //         result.error || 
// //         "Failed to save preferences. Please try again."
// //       );
// //     }

// //     setSaveStatus("success");
// //     mutate();
    
// //     toast({
// //       title: "Success",
// //       description: "Your preferences have been saved successfully",
// //     });
// //   } catch (error) {
// //     console.error("Error saving preferences:", error);
// //     setSaveStatus("error");
    
// //     toast({
// //       title: "Error",
// //       description: error instanceof Error ? error.message : "Failed to save preferences",
// //       variant: "destructive",
// //     });
// //   } finally {
// //     setIsSaving(false);
// //   }
// // }
// //   const handleSave = async () => {
// //   setIsSaving(true)
// //   setSaveStatus("idle")
  
// //   try {
// //     const response = await fetch("/api/notifications/preferences", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(formData),
// //     })

// //     const result = await response.json()

// //     if (!response.ok) {
// //       throw new Error(
// //         result.details || 
// //         result.error || 
// //         "Failed to save preferences. Please try again."
// //       )
// //     }

// //     setSaveStatus("success")
// //     mutate() // Revalidate the SWR cache
    
// //     toast({
// //       title: "Success",
// //       description: "Your preferences have been saved successfully",
// //     })
// //   } catch (error) {
// //     console.error("Error saving preferences:", error)
// //     setSaveStatus("error")
    
// //     toast({
// //       title: "Error",
// //       description: error instanceof Error ? error.message : "Failed to save preferences",
// //       variant: "destructive",
// //     })
// //   } finally {
// //     setIsSaving(false)
// //   }
// // }
// //   const handleSave = async () => {
// //   setIsSaving(true)
// //   setSaveStatus("idle")
  
// //   try {
// //     const response = await fetch("/api/notifications/preferences", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(formData),
// //     })

// //     const result = await response.json()

// //     if (!response.ok) {
// //       throw new Error(result.error || "Failed to save preferences")
// //     }

// //     setSaveStatus("success")
// //     mutate() // Revalidate the SWR cache
    
// //     toast({
// //       title: "Success",
// //       description: "Your preferences have been saved successfully",
// //     })
// //   } catch (error) {
// //     console.error("Error saving preferences:", error)
// //     setSaveStatus("error")
    
// //     toast({
// //       title: "Error",
// //       description: error instanceof Error ? error.message : "Failed to save preferences",
// //       variant: "destructive",
// //     })
// //   } finally {
// //     setIsSaving(false)
// //   }
// // }

//   // const handleSave = async () => {
//   //   setIsSaving(true)
//   //   setSaveStatus("idle")
    
//   //   try {
//   //     const response = await fetch("/api/notifications/preferences", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(formData),
//   //     })

//   //     const data = await response.json()

//   //     if (!response.ok) {
//   //       throw new Error(data.error || "Failed to save preferences")
//   //     }

//   //     setSaveStatus("success")
//   //     mutate() // Revalidate the SWR cache
      
//   //     toast({
//   //       title: "Success",
//   //       description: "Your preferences have been saved successfully",
//   //     })
//   //   } catch (error) {
//   //     console.error("Error saving preferences:", error)
//   //     setSaveStatus("error")
      
//   //     toast({
//   //       title: "Error",
//   //       description: error instanceof Error ? error.message : "Failed to save preferences",
//   //       variant: "destructive",
//   //     })
//   //   } finally {
//   //     setIsSaving(false)
      
//   //     // Reset success message after 3 seconds
//   //     if (saveStatus === "success") {
//   //       setTimeout(() => setSaveStatus("idle"), 3000)
//   //     }
//   //   }
//   // }

// //   const handleAddEmail = (email: string) => {
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// //     if (email && emailRegex.test(email) && !formData.email_recipients.includes(email)) {
// //       setFormData({
// //         ...formData,
// //         email_recipients: [...formData.email_recipients, email],
// //       })
// //     }
// //   }

// //   const handleRemoveEmail = (email: string) => {
// //     setFormData({
// //       ...formData,
// //       email_recipients: formData.email_recipients.filter((e) => e !== email),
// //     })
// //   }

// //   // Add a new state for the email input
// //   const [emailInput, setEmailInput] = useState("")

// //   // Add this function to handle email input changes
// //   const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setEmailInput(e.target.value)
// //   }

// //   // Add this function to handle adding an email when pressing Enter
// //   const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
// //     if (e.key === "Enter") {
// //       e.preventDefault()
// //       handleAddEmail(emailInput)
// //       setEmailInput("")
// //     }
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <div>
// //         <h1 className="text-3xl font-bold text-white">Settings</h1>
// //         <p className="text-slate-400 mt-1">Manage your notification preferences</p>
// //       </div>

// //       {/* Save Status Indicator */}
// //       {saveStatus === "success" && (
// //         <div className="bg-green-900/30 border border-green-800 text-green-200 px-4 py-3 rounded-md flex items-center gap-2">
// //           <CheckCircle className="w-5 h-5" />
// //           <span>Preferences saved successfully!</span>
// //         </div>
// //       )}

// //       {saveStatus === "error" && (
// //         <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-md flex items-center gap-2">
// //           <XCircle className="w-5 h-5" />
// //           <span>Failed to save preferences. Please try again.</span>
// //         </div>
// //       )}

// //       {/* Rest of your form... */}
// //       {/* Make sure to update your form inputs to use the formData state */}
// //       {/* For example: */}
// //       <Card className="bg-slate-800 border-slate-700">
// //         <CardHeader>
// //           <CardTitle className="text-white flex items-center gap-2">
// //             <Bell className="w-5 h-5" />
// //             Notification Preferences
// //           </CardTitle>
// //         </CardHeader>
// //         <CardContent className="space-y-6">
// //           {/* Email Recipients */}
// //           <div className="space-y-3">
// //             <Label className="text-white font-medium">Email Recipients</Label>
// //             <div className="flex gap-2">
// //               <Input
// //                 type="email"
// //                 placeholder="Add email address"
// //                 className="bg-slate-700 border-slate-600 text-white"
// //                 value={emailInput}
// //                 onChange={handleEmailInputChange}
// //                 onKeyDown={handleEmailKeyDown}
// //               />
// //               <Button
// //                 type="button"
// //                 onClick={() => {
// //                   handleAddEmail(emailInput)
// //                   setEmailInput("")
// //                 }}
// //                 disabled={!emailInput}
// //               >
// //                 Add
// //               </Button>
// //             </div>
// //             {formData.email_recipients.length > 0 && (
// //               <div className="mt-2 space-y-1">
// //                 {formData.email_recipients.map((email) => (
// //                   <div
// //                     key={email}
// //                     className="flex items-center justify-between bg-slate-700/50 px-3 py-2 rounded"
// //                   >
// //                     <span className="text-slate-300">{email}</span>
// //                     <button
// //                       type="button"
// //                       onClick={() => handleRemoveEmail(email)}
// //                       className="text-red-400 hover:text-red-300"
// //                     >
// //                       Remove
// //                     </button>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* Save Button */}
// //           <div className="pt-4">
// //             <Button
// //               onClick={handleSave}
// //               disabled={isSaving}
// //               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
// //             >
// //               {isSaving ? (
// //                 <>
// //                   <span className="animate-spin">↻</span>
// //                   Saving...
// //                 </>
// //               ) : (
// //                 <>
// //                   <Save className="w-4 h-4" />
// //                   Save Preferences
// //                 </>
// //               )}
// //             </Button>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   )
// // }




// // import { useState } from "react"
// // import useSWR from "swr"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Bell, Save } from "lucide-react"

// // const fetcher = (url: string) => fetch(url).then((r) => r.json())

// // interface SettingsPageProps {
// //   merchantId: string
// // }

// // export default function SettingsPage({ merchantId }: SettingsPageProps) {
// //   const { data: prefsData, mutate } = useSWR("/api/notifications/preferences", fetcher)
// //   const [isSaving, setIsSaving] = useState(false)
// //   const [formData, setFormData] = useState({
// //     email_alerts: true,
// //     webhook_alerts: false,
// //     sms_alerts: false,
// //     notify_on_critical: true,
// //     notify_on_high: true,
// //     notify_on_medium: false,
// //     email_recipients: [] as string[],
// //     webhook_url: "",
// //     alert_threshold: 50,
// //   })

// //   // Initialize form with fetched data
// //   useState(() => {
// //     if (prefsData?.preferences) {
// //       setFormData(prefsData.preferences)
// //     }
// //   }, [prefsData])

// //   const handleSave = async () => {
// //     setIsSaving(true)
// //     try {
// //       const response = await fetch("/api/notifications/preferences", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(formData),
// //       })

// //       if (response.ok) {
// //         mutate()
// //       }
// //     } catch (error) {
// //       console.error("Error saving preferences:", error)
// //     } finally {
// //       setIsSaving(false)
// //     }
// //   }

// //   const handleAddEmail = (email: string) => {
// //     if (email && !formData.email_recipients.includes(email)) {
// //       setFormData({
// //         ...formData,
// //         email_recipients: [...formData.email_recipients, email],
// //       })
// //     }
// //   }

// //   const handleRemoveEmail = (email: string) => {
// //     setFormData({
// //       ...formData,
// //       email_recipients: formData.email_recipients.filter((e) => e !== email),
// //     })
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <div>
// //         <h1 className="text-3xl font-bold text-white">Settings</h1>
// //         <p className="text-slate-400 mt-1">Manage your notification preferences</p>
// //       </div>

// //       {/* Notification Preferences */}
// //       <Card className="bg-slate-800 border-slate-700">
// //         <CardHeader>
// //           <CardTitle className="text-white flex items-center gap-2">
// //             <Bell className="w-5 h-5" />
// //             Notification Preferences
// //           </CardTitle>
// //         </CardHeader>
// //         <CardContent className="space-y-6">
// //           {/* Alert Severity */}
// //           <div className="space-y-3">
// //             <Label className="text-white font-medium">Alert Severity</Label>
// //             <div className="space-y-2">
// //               <label className="flex items-center gap-3 text-slate-300">
// //                 <input
// //                   type="checkbox"
// //                   checked={formData.notify_on_critical}
// //                   onChange={(e) => setFormData({ ...formData, notify_on_critical: e.target.checked })}
// //                   className="w-4 h-4"
// //                 />
// //                 Critical Alerts
// //               </label>
// //               <label className="flex items-center gap-3 text-slate-300">
// //                 <input
// //                   type="checkbox"
// //                   checked={formData.notify_on_high}
// //                   onChange={(e) => setFormData({ ...formData, notify_on_high: e.target.checked })}
// //                   className="w-4 h-4"
// //                 />
// //                 High Risk Alerts
// //               </label>
// //               <label className="flex items-center gap-3 text-slate-300">
// //                 <input
// //                   type="checkbox"
// //                   checked={formData.notify_on_medium}
// //                   onChange={(e) => setFormData({ ...formData, notify_on_medium: e.target.checked })}
// //                   className="w-4 h-4"
// //                 />
// //                 Medium Risk Alerts
// //               </label>
// //             </div>
// //           </div>

// //           {/* Notification Channels */}
// //           <div className="space-y-3 border-t border-slate-700 pt-6">
// //             <Label className="text-white font-medium">Notification Channels</Label>
// //             <label className="flex items-center gap-3 text-slate-300">
// //               <input
// //                 type="checkbox"
// //                 checked={formData.email_alerts}
// //                 onChange={(e) => setFormData({ ...formData, email_alerts: e.target.checked })}
// //                 className="w-4 h-4"
// //               />
// //               Email Notifications
// //             </label>
// //             <label className="flex items-center gap-3 text-slate-300">
// //               <input
// //                 type="checkbox"
// //                 checked={formData.webhook_alerts}
// //                 onChange={(e) => setFormData({ ...formData, webhook_alerts: e.target.checked })}
// //                 className="w-4 h-4"
// //               />
// //               Webhook Notifications
// //             </label>
// //             <label className="flex items-center gap-3 text-slate-300">
// //               <input
// //                 type="checkbox"
// //                 checked={formData.sms_alerts}
// //                 onChange={(e) => setFormData({ ...formData, sms_alerts: e.target.checked })}
// //                 className="w-4 h-4"
// //                 disabled
// //               />
// //               SMS Notifications (Coming Soon)
// //             </label>
// //           </div>

// //           {/* Email Recipients */}
// //           {formData.email_alerts && (
// //             <div className="space-y-3 border-t border-slate-700 pt-6">
// //               <Label className="text-white font-medium">Email Recipients</Label>
// //               <div className="flex gap-2">
// //                 <Input
// //                   type="email"
// //                   placeholder="email@example.com"
// //                   id="email-input"
// //                   className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
// //                 />
// //                 <Button
// //                   onClick={() => {
// //                     const input = document.getElementById("email-input") as HTMLInputElement
// //                     if (input) {
// //                       handleAddEmail(input.value)
// //                       input.value = ""
// //                     }
// //                   }}
// //                   className="bg-blue-600 hover:bg-blue-700"
// //                 >
// //                   Add
// //                 </Button>
// //               </div>
// //               <div className="flex flex-wrap gap-2">
// //                 {formData.email_recipients.map((email) => (
// //                   <div
// //                     key={email}
// //                     className="bg-slate-700 px-3 py-1 rounded text-slate-300 text-sm flex items-center gap-2"
// //                   >
// //                     {email}
// //                     <button onClick={() => handleRemoveEmail(email)} className="text-slate-400 hover:text-red-400">
// //                       ×
// //                     </button>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           {/* Webhook URL */}
// //           {formData.webhook_alerts && (
// //             <div className="space-y-3 border-t border-slate-700 pt-6">
// //               <Label className="text-white font-medium">Webhook URL</Label>
// //               <Input
// //                 type="url"
// //                 placeholder="https://your-domain.com/webhook"
// //                 value={formData.webhook_url}
// //                 onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
// //                 className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
// //               />
// //             </div>
// //           )}

// //           {/* Save Button */}
// //           <div className="border-t border-slate-700 pt-6 flex gap-2">
// //             <Button
// //               onClick={handleSave}
// //               disabled={isSaving}
// //               className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
// //             >
// //               <Save className="w-4 h-4" />
// //               {isSaving ? "Saving..." : "Save Preferences"}
// //             </Button>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   )
// // }
// // components/dashboard/settings-page.tsx
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Save, CheckCircle, XCircle } from "lucide-react"
// import { toast } from "@/components/ui/use-toast"
// import { getPreferences, savePreferences, DEFAULT_PREFERENCES } from "@/lib/storage"

// export default function SettingsPage() {
//   const [isSaving, setIsSaving] = useState(false)
//   const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
//   const [formData, setFormData] = useState(DEFAULT_PREFERENCES)

//   // Load preferences from localStorage on component mount
//   useEffect(() => {
//     const prefs = getPreferences() || DEFAULT_PREFERENCES
//     setFormData(prefs)
//   }, [])

//   const handleSave = () => {
//     setIsSaving(true)
//     setSaveStatus("idle")
    
//     try {
//       savePreferences(formData)
//       setSaveStatus("success")
//       toast({
//         title: "Success",
//         description: "Your preferences have been saved successfully",
//       })
//     } catch (error) {
//       console.error("Error saving preferences:", error)
//       setSaveStatus("error")
//       toast({
//         title: "Error",
//         description: "Failed to save preferences",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, type, value, checked } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }))
//   }

//   const handleEmailRecipientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const emails = e.target.value
//       .split(',')
//       .map(email => email.trim())
//       .filter(email => email.includes('@')) // Basic email validation
//     setFormData(prev => ({ ...prev, email_recipients: emails }))
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Notification Preferences</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium">Email Notifications</h3>
//             <div className="space-y-2">
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="email_alerts"
//                   name="email_alerts"
//                   checked={formData.email_alerts}
//                   onChange={handleChange}
//                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <Label htmlFor="email_alerts">Enable email alerts</Label>
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="email_recipients">Email Recipients</Label>
//                 <Input
//                   id="email_recipients"
//                   name="email_recipients"
//                   placeholder="comma-separated emails"
//                   value={formData.email_recipients.join(', ')}
//                   onChange={handleEmailRecipientsChange}
//                   disabled={!formData.email_alerts}
//                 />
//                 <p className="text-sm text-gray-500">
//                   {formData.email_recipients.length} email(s) configured
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <h3 className="text-lg font-medium">Alert Threshold</h3>
//             <div className="space-y-2">
//               <div className="flex items-center space-x-4">
//                 <input
//                   type="range"
//                   id="alert_threshold"
//                   name="alert_threshold"
//                   min="0"
//                   max="100"
//                   value={formData.alert_threshold}
//                   onChange={handleChange}
//                   className="w-full"
//                 />
//                 <span className="w-12 text-center">{formData.alert_threshold}%</span>
//               </div>
//               <p className="text-sm text-gray-500">
//                 Set the risk score threshold for triggering alerts
//               </p>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <h3 className="text-lg font-medium">Notification Types</h3>
//             <div className="space-y-2">
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="notify_on_critical"
//                   name="notify_on_critical"
//                   checked={formData.notify_on_critical}
//                   onChange={handleChange}
//                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <Label htmlFor="notify_on_critical">Critical alerts</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="notify_on_high"
//                   name="notify_on_high"
//                   checked={formData.notify_on_high}
//                   onChange={handleChange}
//                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <Label htmlFor="notify_on_high">High severity alerts</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="notify_on_medium"
//                   name="notify_on_medium"
//                   checked={formData.notify_on_medium}
//                   onChange={handleChange}
//                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <Label htmlFor="notify_on_medium">Medium severity alerts</Label>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <Button
//               onClick={handleSave}
//               disabled={isSaving}
//               className="flex items-center space-x-2"
//             >
//               {isSaving ? (
//                 <>
//                   <span>Saving...</span>
//                 </>
//               ) : saveStatus === "success" ? (
//                 <>
//                   <CheckCircle className="h-4 w-4" />
//                   <span>Saved</span>
//                 </>
//               ) : saveStatus === "error" ? (
//                 <>
//                   <XCircle className="h-4 w-4" />
//                   <span>Error</span>
//                 </>
//               ) : (
//                 <>
//                   <Save className="h-4 w-4" />
//                   <span>Save Preferences</span>
//                 </>
//               )}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Save, CheckCircle, XCircle, Bell } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getPreferences, savePreferences, DEFAULT_PREFERENCES } from "@/lib/storage"

interface SettingsPageProps {
  merchantId: string;
}

export default function SettingsPage({ merchantId }: SettingsPageProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [formData, setFormData] = useState(DEFAULT_PREFERENCES)
  const [emailInput, setEmailInput] = useState("")

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const prefs = getPreferences() || DEFAULT_PREFERENCES;
    setFormData(prefs);
  }, []);

  const handleSave = () => {
    setIsSaving(true)
    setSaveStatus("idle")
    
    try {
      savePreferences(formData)
      setSaveStatus("success")
      toast({
        title: "Success",
        description: "Your preferences have been saved successfully",
      })
    } catch (error) {
      console.error("Error saving preferences:", error)
      setSaveStatus("error")
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddEmail = () => {
    const email = emailInput.trim()
    if (email && !formData.email_recipients.includes(email)) {
      setFormData(prev => ({
        ...prev,
        email_recipients: [...prev.email_recipients, email]
      }))
      setEmailInput("")
    }
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      email_recipients: prev.email_recipients.filter(email => email !== emailToRemove)
    }))
  }

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddEmail()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your notification preferences</p>
      </div>

      {saveStatus === "success" && (
        <div className="bg-green-900/30 border border-green-800 text-green-200 px-4 py-3 rounded-md flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      {saveStatus === "error" && (
        <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-md flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          <span>Failed to save preferences. Please try again.</span>
        </div>
      )}

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Email Notifications</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="email_alerts"
                  name="email_alerts"
                  checked={formData.email_alerts}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-600 bg-slate-700 text-blue-500 focus:ring-blue-600 focus:ring-offset-slate-800"
                />
                <Label htmlFor="email_alerts" className="text-slate-300">Enable email alerts</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email_recipients" className="text-slate-300">Email Recipients</Label>
                <div className="flex gap-2">
                  <Input
                    id="email_recipients"
                    type="email"
                    placeholder="Enter email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleEmailKeyDown}
                    disabled={!formData.email_alerts}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    type="button"
                    onClick={handleAddEmail}
                    disabled={!emailInput || !formData.email_alerts}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                {formData.email_recipients.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData.email_recipients.map((email) => (
                      <div key={email} className="flex items-center justify-between bg-slate-700/50 px-3 py-2 rounded">
                        <span className="text-slate-300">{email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email)}
                          className="text-red-400 hover:text-red-300 p-1"
                          disabled={!formData.email_alerts}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Alert Threshold</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  id="alert_threshold"
                  name="alert_threshold"
                  min="0"
                  max="100"
                  value={formData.alert_threshold}
                  onChange={handleChange}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 text-center text-white">{formData.alert_threshold}%</span>
              </div>
              <p className="text-sm text-slate-400">
                Set the risk score threshold for triggering alerts
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Notification Types</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notify_on_critical"
                  name="notify_on_critical"
                  checked={formData.notify_on_critical}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-600 bg-slate-700 text-red-500 focus:ring-red-500 focus:ring-offset-slate-800"
                />
                <Label htmlFor="notify_on_critical" className="text-slate-300">Critical alerts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notify_on_high"
                  name="notify_on_high"
                  checked={formData.notify_on_high}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-600 bg-slate-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-800"
                />
                <Label htmlFor="notify_on_high" className="text-slate-300">High severity alerts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notify_on_medium"
                  name="notify_on_medium"
                  checked={formData.notify_on_medium}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-600 bg-slate-700 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-slate-800"
                />
                <Label htmlFor="notify_on_medium" className="text-slate-300">Medium severity alerts</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? (
                <>
                  <span>Saving...</span>
                </>
              ) : saveStatus === "success" ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Saved</span>
                </>
              ) : saveStatus === "error" ? (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Error</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Preferences</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}