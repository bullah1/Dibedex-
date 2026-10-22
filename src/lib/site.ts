import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: number;
  product_price: number;
  delivery_charge: number;
  whatsapp_number: string;
  call_number: string;
  disclaimer_text: string;
  product_image: string | null;
  site_logo: string | null;
};

export type SiteStats = {
  id: number;
  happy_customers: number;
  avg_rating: number;
  delivered_orders: number;
  urgency_text: string;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string | null;
  rating: number;
  text: string;
  is_active: boolean;
  sort_order: number;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  product_price: 1200,
  delivery_charge: 80,
  whatsapp_number: "8801306383938",
  call_number: "01306383938",
  disclaimer_text:
    "এই পণ্য কোনো রোগ নিরাময়ের গ্যারান্টি দেয় না। এটি ডায়াবেটিস ম্যানেজমেন্টে সহায়ক আয়ুর্বেদিক সাপোর্ট হিসেবে ব্যবহারযোগ্য। ব্যবহারের আগে চিকিৎসকের পরামর্শ নিন।",
  product_image: null,
  site_logo: null,
};

export const DEFAULT_STATS: SiteStats = {
  id: 1,
  happy_customers: 10000,
  avg_rating: 4.8,
  delivered_orders: 25000,
  urgency_text:
    "🔥 আজকের অফার চলমান · সারা বাংলাদেশে ক্যাশ অন ডেলিভারি · ফাস্ট ডেলিভারি",
};

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS;
  return data as SiteSettings;
}

export async function fetchStats(): Promise<SiteStats> {
  const { data, error } = await supabase
    .from("stats")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return DEFAULT_STATS;
  return { ...data, avg_rating: Number(data.avg_rating) } as SiteStats;
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as Testimonial[];
}

export function buildWhatsAppLink(number: string, message: string) {
  const clean = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
