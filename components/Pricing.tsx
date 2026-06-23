"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useQuoteWizard } from "./QuoteWizardProvider";
import type { PricingTier } from "@/lib/site-config";
import { DEFAULT_PRICING } from "@/lib/site-config";

interface Props {
  tiers?: PricingTier[];
}

export function Pricing({ tiers = DEFAULT_PRICING }: Props) {
  const { open } = useQuoteWizard();
  const t = useTranslations("Pricing");

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">{t("eyebrow")}</p>
          <h2 className="text-4xl lg:text-5xl font-black text-charcoal mb-4">{t("title")}</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                tier.popular
                  ? "bg-charcoal border-gold/40 shadow-card-hover scale-[1.03]"
                  : "bg-white border-gray-200 shadow-card"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-terra text-ink text-xs font-bold rounded-full px-4 py-1.5 whitespace-nowrap shadow-md">
                    {t("popular")}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-black mb-1 ${tier.popular ? "text-white" : "text-charcoal"}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm mb-4 ${tier.popular ? "text-gray-300" : "text-gray-400"}`}>
                  {tier.desc}
                </p>
                <div className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 border ${
                  tier.popular
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-blue-muted border-blue-brand/20 text-charcoal"
                }`}>
                  <svg className="w-3.5 h-3.5 opacity-60" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M8 5v3.5L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-sm font-bold">{tier.priceLabel || "Pricing coming soon"}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.popular ? "text-gold" : "text-gold-deep"}`} viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span dir="ltr" className={tier.popular ? "text-gray-300" : "text-gray-600"}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => open()}
                className={`w-full rounded-xl py-3 text-sm font-bold transition-all ${
                  tier.popular
                    ? "bg-gold text-ink hover:bg-gold-light"
                    : "bg-blue-brand text-ink hover:bg-blue-dark"
                }`}
              >
                {t("getQuote")}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">{t("footnote")}</p>
      </div>
    </section>
  );
}
