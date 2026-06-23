"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { PALETTES } from "@/data/site";

const CARD_W = 208 + 20; // w-52 (208px) + gap-5 (20px)

export function ColorInspiration() {
  const t = useTranslations("Colors");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const items = [...PALETTES, ...PALETTES];

  const updateButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    updateButtons();
    return () => el.removeEventListener("scroll", updateButtons);
  }, [updateButtons]);

  function scroll(dir: -1 | 1) {
    scrollRef.current?.scrollBy({ left: dir * CARD_W * 3, behavior: "smooth" });
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">{t("eyebrow")}</p>
          <h2 className="text-3xl lg:text-4xl font-black text-charcoal mb-3">{t("title")}</h2>
          <p className="text-gray-500 max-w-lg mx-auto">{t("subtitle")}</p>
        </div>
      </div>

      {/* Carousel wrapper */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          disabled={!canPrev}
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-200 ${
            canPrev ? "opacity-100 hover:bg-gray-50 hover:shadow-lg hover:scale-110" : "opacity-0 pointer-events-none"
          }`}
        >
          <svg className="w-4 h-4 text-charcoal" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          disabled={!canNext}
          className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-200 ${
            canNext ? "opacity-100 hover:bg-gray-50 hover:shadow-lg hover:scale-110" : "opacity-0 pointer-events-none"
          }`}
        >
          <svg className="w-4 h-4 text-charcoal" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-white to-transparent z-[5] pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-white to-transparent z-[5] pointer-events-none" />

        {/* Scroll row */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-5 px-10 pb-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {items.map((palette, i) => (
            <div
              key={i}
              className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-lg transition-shadow p-5 w-52"
            >
              <div className="flex rounded-xl overflow-hidden h-20 mb-4">
                {palette.colors.map((c) => (
                  <div key={c} className="flex-1 h-full" style={{ background: c }} />
                ))}
              </div>
              <p className="font-bold text-sm text-charcoal">{palette.name}</p>
              <p className="text-xs text-gray-400 mt-1">{t("brand")}</p>
            </div>
          ))}
          <div className="flex-shrink-0 w-4" />
        </div>
      </div>
    </section>
  );
}
