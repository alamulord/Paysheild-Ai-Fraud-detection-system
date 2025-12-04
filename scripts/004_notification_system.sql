-- Notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  email_alerts boolean DEFAULT true,
  webhook_alerts boolean DEFAULT true,
  sms_alerts boolean DEFAULT false,
  alert_threshold integer DEFAULT 50,
  notify_on_critical boolean DEFAULT true,
  notify_on_high boolean DEFAULT true,
  notify_on_medium boolean DEFAULT false,
  email_recipients text[] DEFAULT ARRAY[]::text[],
  webhook_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(merchant_id)
);

-- Notification log table
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  alert_id uuid REFERENCES public.alerts(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  notification_type text NOT NULL CHECK (notification_type IN ('email', 'webhook', 'sms', 'in_app')),
  recipient text,
  status text NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  retry_count integer DEFAULT 0,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "notification_preferences_select_own"
  ON public.notification_preferences FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "notification_preferences_update_own"
  ON public.notification_preferences FOR UPDATE
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "notification_preferences_insert_own"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "notification_logs_select_own"
  ON public.notification_logs FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE auth.uid()::text = id::text
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notification_preferences_merchant ON public.notification_preferences(merchant_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_merchant ON public.notification_logs(merchant_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_alert ON public.notification_logs(alert_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created ON public.notification_logs(created_at DESC);
