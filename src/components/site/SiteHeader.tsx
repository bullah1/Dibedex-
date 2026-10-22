import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useSelectedPackage } from "@/lib/packages";

const INK = "#1D1D1F";
const HAIRLINE = "#E8E8ED";
const ACCENT = "#0B6B4F";
const SANS = "'Inter','Hind Siliguri','Noto Sans Bengali',system-ui,sans-serif";

const links = [
  { href: "#benefits", label: "উপকারিতা" },
  { href: "#details", label: "ডিটেইলস" },
  { href: "#reviews", label: "রিভিউ" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pkg } = useSelectedPackage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-xl transition-all duration-300"
      style={{
        fontFamily: SANS,
        backgroundColor: "rgba(255,255,255,0.82)",
        borderBottom: `1px solid ${scrolled ? HAIRLINE : "transparent"}`,
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-2" style={{ color: INK }}>
          <span className="text-[17px] font-semibold tracking-[-0.02em]">Dibedex</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] font-medium transition-opacity hover:opacity-60"
              style={{ color: INK }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#order"
            className="flex h-9 items-center rounded-full px-4 text-[13.5px] font-semibold text-white transition-transform active:scale-95"
            style={{ backgroundColor: ACCENT }}
          >
            অর্ডার · ৳{pkg.price}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full md:hidden"
            style={{ border: `1px solid ${HAIRLINE}`, color: INK }}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden" style={{ backgroundColor: "#fff", borderTop: `1px solid ${HAIRLINE}` }}>
          <nav className="mx-auto flex max-w-5xl flex-col px-5 py-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3.5 text-[15px] font-medium"
                style={{ color: INK, borderBottom: `1px solid ${HAIRLINE}` }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
