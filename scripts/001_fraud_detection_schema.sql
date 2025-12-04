-- Create tables for fraud detection system
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users/Merchants table
CREATE TABLE IF NOT EXISTS public.merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  email text UNIQUE NOT NULL,
  business_name text NOT NULL,
  api_key text UNIQUE NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  tier text DEFAULT 'standard' CHECK (tier IN ('starter', 'standard', 'premium', 'enterprise')),
  webhook_url text,
  settings jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  stripe_payment_intent_id text,
  stripe_payment_method_id text,
  stripe_charge_id text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'succeeded', 'failed', 'requires_action', 'requires_payment_method')),
  payment_error jsonb
);

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  amount decimal(15, 2) NOT NULL,
  currency text DEFAULT 'USD',
  customer_id text NOT NULL,
  customer_email text,
  customer_ip text,
  device_fingerprint text,
  card_last_four text,
  card_brand text,
  transaction_type text NOT NULL CHECK (transaction_type IN ('purchase', 'refund', 'chargeback', 'withdrawal')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'flagged', 'under_review')),
  metadata jsonb DEFAULT '{}'::jsonb,
  geographic_location jsonb,
  user_agent text,
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_customer_id (customer_id),
  INDEX idx_created_at (created_at)
);

-- Fraud signals/features table
CREATE TABLE IF NOT EXISTS public.fraud_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  signal_type text NOT NULL,
  score decimal(5, 2) NOT NULL CHECK (score >= 0 AND score <= 100),
  description text,
  severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Risk scores/predictions table
CREATE TABLE IF NOT EXISTS public.risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  overall_risk_score decimal(5, 2) NOT NULL CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  model_version text,
  features_used jsonb,
  prediction_confidence decimal(5, 2),
  is_fraudulent boolean DEFAULT false,
  manual_review_flag boolean DEFAULT false
);

-- Alerts/Incidents table
CREATE TABLE IF NOT EXISTS public.alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  alert_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  title text NOT NULL,
  description text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved')),
  resolved_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Whitelist/Blacklist table
CREATE TABLE IF NOT EXISTS public.entity_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  list_type text NOT NULL CHECK (list_type IN ('whitelist', 'blacklist')),
  entity_type text NOT NULL CHECK (entity_type IN ('email', 'ip', 'card', 'customer')),
  entity_value text NOT NULL,
  reason text,
  expires_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- ML Model metadata table
-- Payment intents table to track payment flows
CREATE TABLE IF NOT EXISTS public.payment_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  currency text DEFAULT 'usd',
  status text NOT NULL,
  stripe_payment_intent_id text NOT NULL,
  stripe_customer_id text,
  payment_method_types text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  last_payment_error jsonb,
  next_action jsonb,
  client_secret text,
  charges jsonb[],
  refunds jsonb[],
  CONSTRAINT fk_merchant FOREIGN KEY (merchant_id) REFERENCES public.merchants(id)
);

-- Enable RLS for payment_intents
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_intents
CREATE POLICY "payment_intents_own_data"
  ON public.payment_intents
  FOR ALL
  USING (auth.uid()::text = merchant_id::text);

-- Create indexes for payment intents
CREATE INDEX idx_payment_intents_merchant_id ON public.payment_intents(merchant_id);
CREATE INDEX idx_payment_intents_stripe_id ON public.payment_intents(stripe_payment_intent_id);

CREATE TABLE IF NOT EXISTS public.ml_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  model_name text NOT NULL,
  model_version text NOT NULL UNIQUE,
  model_type text NOT NULL,
  performance_metrics jsonb,
  training_data_size integer,
  accuracy decimal(5, 2),
  precision decimal(5, 2),
  recall decimal(5, 2),
  f1_score decimal(5, 2),
  is_active boolean DEFAULT false,
  deployed_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_models ENABLE ROW LEVEL SECURITY;

-- RLS Policies for merchants (users can see their own merchant data)
CREATE POLICY "merchants_select_own"
  ON public.merchants FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "merchants_insert_own"
  ON public.merchants FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "merchants_update_own"
  ON public.merchants FOR UPDATE
  USING (auth.uid()::text = id::text);

-- RLS Policies for transactions (merchants can see their transactions)
CREATE POLICY "transactions_select_own"
  ON public.transactions FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "transactions_insert_own"
  ON public.transactions FOR INSERT
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE auth.uid()::text = id::text
    )
  );

-- Similar policies for fraud_signals, risk_assessments, alerts, entity_lists
CREATE POLICY "fraud_signals_select_own"
  ON public.fraud_signals FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "risk_assessments_select_own"
  ON public.risk_assessments FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "alerts_select_own"
  ON public.alerts FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "entity_lists_select_own"
  ON public.entity_lists FOR SELECT
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE auth.uid()::text = id::text
    )
  );

-- ML models are readable by all authenticated users (system data)
CREATE POLICY "ml_models_select_authenticated"
  ON public.ml_models FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_merchant_created ON public.transactions(merchant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_customer ON public.transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_ip ON public.transactions(customer_ip);
CREATE INDEX IF NOT EXISTS idx_fraud_signals_transaction ON public.fraud_signals(transaction_id);
CREATE INDEX IF NOT EXISTS idx_fraud_signals_merchant ON public.fraud_signals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_transaction ON public.risk_assessments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_alerts_merchant ON public.alerts(merchant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON public.alerts(status);
CREATE INDEX IF NOT EXISTS idx_entity_lists_merchant ON public.entity_lists(merchant_id, entity_type, entity_value);
