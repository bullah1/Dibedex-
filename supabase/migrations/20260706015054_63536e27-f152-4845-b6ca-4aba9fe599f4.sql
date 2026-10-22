CREATE TABLE public.admin_config (
  id integer NOT NULL DEFAULT 1 PRIMARY KEY,
  admin_password text NOT NULL DEFAULT 'dibedex2025',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT admin_config_single_row CHECK (id = 1)
);

GRANT ALL ON public.admin_config TO service_role;

ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated: only service_role (supabaseAdmin) can access.

INSERT INTO public.admin_config (id, admin_password) VALUES (1, 'dibedex2025')
ON CONFLICT (id) DO NOTHING;