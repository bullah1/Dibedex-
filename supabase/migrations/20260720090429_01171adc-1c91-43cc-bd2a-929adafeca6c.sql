ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS consignment_id TEXT,
  ADD COLUMN IF NOT EXISTS tracking_code TEXT,
  ADD COLUMN IF NOT EXISTS courier_status TEXT,
  ADD COLUMN IF NOT EXISTS courier_pushed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS courier_error TEXT;