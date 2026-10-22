CREATE TABLE public.abandoned_checkouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  full_name text,
  phone text NOT NULL,
  address text,
  package_name text,
  quantity integer NOT NULL DEFAULT 1,
  total_amount integer,
  device text,
  status text NOT NULL DEFAULT 'abandoned',
  converted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.abandoned_checkouts TO service_role;
ALTER TABLE public.abandoned_checkouts ENABLE ROW LEVEL SECURITY;