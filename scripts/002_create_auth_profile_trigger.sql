-- Auto-create merchant profile on auth user signup
CREATE OR REPLACE FUNCTION public.handle_new_merchant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.merchants (id, email, business_name, api_key, status, tier)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'business_name', 'New Business'),
    encode(digest(new.id::text || now()::text, 'sha256'), 'hex'),
    'active',
    'starter'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Trigger for auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_merchant();
