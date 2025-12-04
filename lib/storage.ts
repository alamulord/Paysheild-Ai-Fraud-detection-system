// lib/storage.ts
type NotificationPreferences = {
  email_alerts: boolean
  webhook_alerts: boolean
  sms_alerts: boolean
  alert_threshold: number
  notify_on_critical: boolean
  notify_on_high: boolean
  notify_on_medium: boolean
  email_recipients: string[]
  webhook_url?: string
}

const STORAGE_KEY = 'notification_preferences'

export function getPreferences(): NotificationPreferences | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

export function savePreferences(prefs: NotificationPreferences): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  email_alerts: true,
  webhook_alerts: false,
  sms_alerts: false,
  notify_on_critical: true,
  notify_on_high: true,
  notify_on_medium: false,
  email_recipients: [],
  alert_threshold: 50
}