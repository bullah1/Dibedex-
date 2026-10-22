CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  device text NOT NULL DEFAULT 'unknown',
  session_id text,
  path text,
  props jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT ALL ON public.analytics_events TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(event) BETWEEN 1 AND 64
    AND device IN ('mobile','tablet','desktop','unknown')
  );

CREATE INDEX analytics_events_event_created_at_idx
  ON public.analytics_events (event, created_at DESC);
CREATE INDEX analytics_events_created_at_idx
  ON public.analytics_events (created_at DESC);