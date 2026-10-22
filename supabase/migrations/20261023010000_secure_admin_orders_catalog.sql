-- =====================================================================
-- Dibedex: admin security + server-side orders + multi-product orders
-- STEP 1 of 2 — run BEFORE publishing the new code. Safe: changes nothing for the live site.
-- =====================================================================

-- 1) Admin password is now stored as a PBKDF2 hash. The old plain-text
--    column stays only so the first successful login can upgrade it.
ALTER TABLE public.admin_config ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE public.admin_config ALTER COLUMN admin_password DROP DEFAULT;

-- 2) Admin sessions (random token per login; the password is never sent back to the browser)
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  token_hash text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
GRANT ALL ON public.admin_sessions TO service_role;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- 3) Failed login log for brute-force protection
CREATE TABLE IF NOT EXISTS public.admin_login_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_login_attempts_ip_idx ON public.admin_login_attempts (ip, created_at DESC);
GRANT ALL ON public.admin_login_attempts TO service_role;
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- 4) Orders: line items for multi-product orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items jsonb NOT NULL DEFAULT '[]'::jsonb;
CREATE INDEX IF NOT EXISTS orders_phone_created_idx ON public.orders (phone, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders (created_at DESC);

