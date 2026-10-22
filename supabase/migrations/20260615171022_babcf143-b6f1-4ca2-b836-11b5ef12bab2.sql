
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  order_note TEXT,
  product_name TEXT NOT NULL DEFAULT 'Dibedex Syzygium 500 mg',
  product_price INTEGER NOT NULL,
  delivery_charge INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can place an order" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  product_price INTEGER NOT NULL DEFAULT 1200,
  delivery_charge INTEGER NOT NULL DEFAULT 80,
  whatsapp_number TEXT NOT NULL DEFAULT '8801306383938',
  call_number TEXT NOT NULL DEFAULT '01306383938',
  product_image TEXT,
  site_logo TEXT,
  disclaimer_text TEXT NOT NULL DEFAULT 'এই পণ্য কোনো রোগ নিরাময়ের গ্যারান্টি দেয় না। এটি ডায়াবেটিস ম্যানেজমেন্টে সহায়ক আয়ুর্বেদিক সাপোর্ট হিসেবে ব্যবহারযোগ্য। ব্যবহারের আগে চিকিৎসকের পরামর্শ নিন।',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);

GRANT SELECT ON public.settings TO anon, authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON public.settings FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.settings (id) VALUES (1) ON CONFLICT DO NOTHING;
