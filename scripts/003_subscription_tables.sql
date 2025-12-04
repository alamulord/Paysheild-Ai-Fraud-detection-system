-- Subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  description text,
  stripe_price_id text UNIQUE NOT NULL,
  amount_cents integer NOT NULL,
  currency text DEFAULT 'usd',
  billing_interval text NOT NULL CHECK (billing_interval IN ('month', 'year')),
  features jsonb DEFAULT '[]'::jsonb,
  tier text NOT NULL CHECK (tier IN ('starter', 'standard', 'premium', 'enterprise')),
  is_active boolean DEFAULT true,
  transaction_limit integer,
  api_limit_per_month integer
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_customer_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  canceled_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Transactions/Payments table for billing history
CREATE TABLE IF NOT EXISTS public.billing_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  stripe_payment_id text UNIQUE NOT NULL,
  amount_cents integer NOT NULL,
  currency text DEFAULT 'usd',
  status text NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed')),
  invoice_url text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "subscription_plans_select"
  ON public.subscription_plans FOR SELECT
  USING (is_active = true);

CREATE POLICY "subscriptions_select_own"
  ON public.subscriptions FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "billing_transactions_select_own"
  ON public.billing_transactions FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE auth.uid()::text = id::text
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_merchant ON public.subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_merchant ON public.billing_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_billing_stripe ON public.billing_transactions(stripe_payment_id);
