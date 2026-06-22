"use client";
import { motion } from "framer-motion";
import { useQuoteWizard } from "./QuoteWizardProvider";
import { PACKAGES } from "@/data/site";
import clsx from "clsx";

export function Pricing() {
  const { open } = useQuoteWizard();
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">Transparent pricing</p>
          <h2 className="text-4xl lg:text-5xl font-black text-charcoal mb-4">Packages &amp; pricing</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Indicative pricing to help you plan. Every quote is free, itemised and obligation-free.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={clsx(
                "relative rounded-2xl border p-8 flex flex-col",
                pkg.popular
                  ? "bg-blue-brand border-blue-brand shadow-card-hover scale-[1.03]"
                  : "bg-white border-gray-200 shadow-card"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-terra text-white text-xs font-bold rounded-full px-4 py-1.5 whitespace-nowrap shadow-md">
                    ★ Most popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className={clsx("text-xl font-black mb-1", pkg.popular ? "text-white" : "text-charcoal")}>
                  {pkg.name}
                </h3>
                <p className={clsx("text-sm mb-3", pkg.popular ? "text-blue-200" : "text-gray-400")}>
                  {pkg.desc}
                </p>
                <p className={clsx("text-3xl font-black", pkg.popular ? "text-white" : "text-charcoal")}>
                  {pkg.price}
                </p>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <svg className={clsx("w-4 h-4 mt-0.5 flex-shrink-0", pkg.popular ? "text-white" : "text-blue-brand")} viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={pkg.popular ? "text-blue-100" : "text-gray-600"}>{f}</span>
                  </li>
                ))}
                {pkg.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <svg className={clsx("w-4 h-4 mt-0.5 flex-shrink-0", pkg.popular ? "text-blue-300" : "text-gray-300")} viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M5.5 10.5l5-5M10.5 10.5l-5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    <span className={pkg.popular ? "text-blue-300 line-through" : "text-gray-300 line-through"}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={open}
                className={clsx(
                  "w-full rounded-xl py-3 text-sm font-bold transition-all",
                  pkg.popular
                    ? "bg-white text-blue-brand hover:bg-blue-50"
                    : "bg-blue-brand text-white hover:bg-blue-dark"
                )}
              >
                {pkg.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          All prices are indicative. Final price depends on property size, surface condition and paint selected.
          Free on-site assessment before any commitment.
        </p>
      </div>
    </section>
  );
}
