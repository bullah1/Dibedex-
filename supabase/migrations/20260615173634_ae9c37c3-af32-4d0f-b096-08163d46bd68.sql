CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  rating int NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  text text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE TABLE public.stats (
  id int PRIMARY KEY DEFAULT 1,
  happy_customers int NOT NULL DEFAULT 10000,
  avg_rating numeric(2,1) NOT NULL DEFAULT 4.8,
  delivered_orders int NOT NULL DEFAULT 25000,
  urgency_text text NOT NULL DEFAULT '🔥 আজকের অফার চলমান · সারা বাংলাদেশে ক্যাশ অন ডেলিভারি · ফাস্ট ডেলিভারি',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT stats_singleton CHECK (id = 1)
);

GRANT SELECT ON public.stats TO anon, authenticated;
GRANT ALL ON public.stats TO service_role;

ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stats"
  ON public.stats FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO public.stats (id) VALUES (1);

INSERT INTO public.testimonials (name, location, rating, text, sort_order) VALUES
  ('রাশেদুল ইসলাম', 'ঢাকা', 5, 'নিয়মিত খাচ্ছি, ডায়েট আর হাঁটার পাশাপাশি ভালো সাপোর্ট পাচ্ছি। ডেলিভারি দ্রুত ছিল।', 1),
  ('সালমা আক্তার', 'চট্টগ্রাম', 5, 'প্যাকেজিং অরিজিনাল, ক্যাশ অন ডেলিভারিতে পেয়েছি। প্রতিনিধিও খুব ভালো ব্যবহার করেছেন।', 2),
  ('আব্দুল করিম', 'রাজশাহী', 4, 'ডাক্তারের পরামর্শে শুরু করেছি। সহজে খাওয়া যায়, রুটিনে রাখতে কোনো সমস্যা হচ্ছে না।', 3);