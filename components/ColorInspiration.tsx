import { useTranslations } from "next-intl";
import { PALETTES } from "@/data/site";

export function ColorInspiration() {
  const t = useTranslations("Colors");
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">{t("eyebrow")}</p>
          <h2 className="text-3xl lg:text-4xl font-black text-charcoal mb-3">{t("title")}</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Auto-scroll row */}
      <div className="flex overflow-x-auto scrollbar-hide gap-5 px-6 pb-4">
        {[...PALETTES, ...PALETTES].map((palette, i) => (
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
      </div>
    </section>
  );
}
