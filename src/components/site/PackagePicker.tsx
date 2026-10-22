import { ShoppingBag, ArrowRight } from "lucide-react";
import { PACKAGES, selectPackage, useSelectedPackage } from "@/lib/packages";
import { track } from "@/lib/analytics";

const CREAM = "#FDFCF0";
const EMERALD = "#064E3B";
const GOLD = "#B19470";
const GOLD_DEEP = "#A16207";
const BORDER = "#F1E9D2";

export function PackagePicker() {
  const { id: selected } = useSelectedPackage();

  const handleSelect = (id: (typeof PACKAGES)[number]["id"]) => {
    selectPackage(id);
  };

  const handleOrder = (id: (typeof PACKAGES)[number]["id"]) => {
    handleSelect(id);
    track("cta_click", { type: "order", location: "package_card", package_id: id });
    setTimeout(() => {
      document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <section
      id="packages"
      className="py-10 font-['Inter',sans-serif] md:py-14"
      style={{ backgroundColor: CREAM }}
    >
      <div className="mx-auto max-w-md px-5 md:max-w-2xl">
        <div className="text-center">
          <span
            className="mb-2 inline-block text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: GOLD_DEEP }}
          >
            প্যাকেজ নির্বাচন করুন
          </span>
          <h2
            className="text-2xl font-bold md:text-3xl"
            style={{ fontFamily: "'Lora', serif", color: EMERALD }}
          >
            যত বেশি Capsules · তত বেশি <span className="italic" style={{ color: GOLD_DEEP }}>Savings</span>
          </h2>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {PACKAGES.map((pkg) => {
            const isActive = selected === pkg.id;
            const save = pkg.mrp - pkg.price;
            const months =
              pkg.capsules <= 30 ? "১৫ দিনের কোর্স" : pkg.capsules <= 60 ? "৩০ দিনের কোর্স" : "৪৫ দিনের ফুল কোর্স";
            const badge = pkg.badge;

            return (
              <div
                key={pkg.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(pkg.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(pkg.id);
                  }
                }}
                className={`relative cursor-pointer rounded-2xl p-4 transition-all ${
                  isActive ? "shadow-lg shadow-emerald-900/20" : "shadow-sm"
                }`}
                style={{
                  backgroundColor: isActive ? EMERALD : "white",
                  borderWidth: 2,
                  borderColor: isActive ? GOLD : BORDER,
                }}
              >
                {badge ? (
                  <span
                    className="absolute -top-3 left-4 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm"
                    style={{ backgroundColor: GOLD }}
                  >
                    {badge}
                  </span>
                ) : null}

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2"
                      style={{
                        borderColor: isActive ? GOLD : "#cbd5e1",
                        backgroundColor: isActive ? GOLD : "transparent",
                      }}
                    >
                      {isActive ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      ) : null}
                    </span>
                    <div>
                      <div
                        className="text-base font-bold"
                        style={{ color: isActive ? "white" : EMERALD }}
                      >
                        {pkg.name}
                      </div>
                      <div
                        className="text-[11px]"
                        style={{ color: isActive ? "rgba(255,255,255,0.7)" : "#94a3b8" }}
                      >
                        {months}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-xs line-through"
                      style={{ color: isActive ? "rgba(255,255,255,0.55)" : "#cbd5e1" }}
                    >
                      ৳{pkg.mrp}
                    </div>
                    <div
                      className="text-lg font-bold"
                      style={{
                        fontFamily: "'Lora', serif",
                        color: isActive ? "white" : EMERALD,
                      }}
                    >
                      ৳{pkg.price}
                    </div>
                  </div>
                </div>

                {isActive ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrder(pkg.id);
                    }}
                    className="group mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-transform active:scale-[0.98]"
                    style={{ backgroundColor: GOLD }}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    এখনই অর্ডার করুন · Save ৳{save}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>

        <div
          className="mt-6 flex items-center justify-center gap-4 text-xs font-medium"
          style={{ color: EMERALD }}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GOLD_DEEP }} />
            ক্যাশ অন ডেলিভারি
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GOLD_DEEP }} />
            ১০০% অরিজিনাল
          </span>
        </div>
      </div>
    </section>
  );
}
