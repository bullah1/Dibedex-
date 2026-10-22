import { Star, BadgeCheck, Play } from "lucide-react";
import review1 from "@/assets/review-1.jpg";
import review2 from "@/assets/review-2.jpg";
import type { Testimonial } from "@/lib/site";
import { Reveal } from "./Reveal";
import { HAIRLINE, INK, SANS, SUBTLE, ACCENT, ACCENT_SOFT } from "./theme";

type PhotoReview = {
  img: string;
  name: string;
  location: string;
  text: string;
  video?: string;
};

const PHOTO_REVIEWS: PhotoReview[] = [
  {
    img: review1,
    name: "রহিম উদ্দিন",
    location: "ঢাকা",
    text: "৩ মাস নিয়মিত খাচ্ছি। সুগার রিপোর্ট আগের চেয়ে অনেক ভালো, দুর্বলতাও কমেছে।",
  },
  {
    img: review2,
    name: "নাসিমা আক্তার",
    location: "চট্টগ্রাম",
    text: "অরিজিনাল প্রোডাক্ট, হোম ডেলিভারিতে পেয়েছি। পরিবারের সবাইকে recommend করছি।",
  },
];

const FALLBACK: Testimonial[] = [
  {
    id: "f1",
    name: "কামরুল হাসান",
    location: "সিলেট",
    rating: 5,
    text: "ডেলিভারি দ্রুত ছিল, ক্যাশ অন ডেলিভারিতে নিয়েছি। প্যাকেজিং একদম পরিপাটি।",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "f2",
    name: "শাহনাজ পারভীন",
    location: "রাজশাহী",
    rating: 5,
    text: "দ্বিতীয়বার অর্ডার করলাম। নিয়ম মেনে খেলে সত্যিই ভালো লাগে।",
    is_active: true,
    sort_order: 2,
  },
  {
    id: "f3",
    name: "আব্দুল করিম",
    location: "খুলনা",
    rating: 5,
    text: "সাপোর্ট টিম ফোনে সব বুঝিয়ে দিয়েছে। সার্ভিস প্রিমিয়াম।",
    is_active: true,
    sort_order: 3,
  },
];

function Stars() {
  return (
    <span className="flex" style={{ color: "#F5A524" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-[13px] w-[13px] fill-current" strokeWidth={0} />
      ))}
    </span>
  );
}

export function ReviewsGallery({ testimonials }: { testimonials: Testimonial[] }) {
  const list = testimonials.length ? testimonials.slice(0, 6) : FALLBACK;

  return (
    <section id="reviews" className="bg-white" style={{ fontFamily: SANS, color: INK }}>
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-20">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
            Customer reviews
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[36px]">
              গ্রাহকদের মতামত
            </h2>
          </div>
        </Reveal>

        {/* Photo / video reviews */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PHOTO_REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 70}>
              <figure
                className="overflow-hidden rounded-3xl bg-white"
                style={{ border: `1px solid ${HAIRLINE}` }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ backgroundColor: "#F5F5F7" }}>
                  <img
                    src={r.img}
                    alt={`${r.name} — Dibedex গ্রাহক রিভিউ`}
                    width={640}
                    height={640}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  {r.video && (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90">
                        <Play className="h-6 w-6" style={{ color: ACCENT }} />
                      </span>
                    </span>
                  )}
                </div>
                <figcaption className="p-5">
                  <Stars />
                  <p className="mt-2.5 text-[14.5px] leading-relaxed">{r.text}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-[13px]" style={{ color: SUBTLE }}>
                    <BadgeCheck className="h-4 w-4" style={{ color: ACCENT }} />
                    {r.name} · {r.location} · ভেরিফায়েড ক্রেতা
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Text reviews */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t, i) => (
            <Reveal key={t.id} delay={i * 50}>
              <div className="h-full rounded-3xl p-5" style={{ border: `1px solid ${HAIRLINE}` }}>
                <Stars />
                <p className="mt-2.5 text-[14px] leading-relaxed">{t.text}</p>
                <div className="mt-4 flex items-center gap-2.5">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full text-[13px] font-semibold"
                    style={{ backgroundColor: ACCENT_SOFT, color: ACCENT }}
                  >
                    {t.name.slice(0, 1)}
                  </span>
                  <span className="text-[13px]" style={{ color: SUBTLE }}>
                    {t.name}
                    {t.location ? ` · ${t.location}` : ""}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
