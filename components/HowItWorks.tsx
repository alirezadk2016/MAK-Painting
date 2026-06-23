"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useQuoteWizard } from "./QuoteWizardProvider";
import { STEPS } from "@/data/site";

export function HowItWorks() {
  const { open } = useQuoteWizard();
  const t = useTranslations("HowItWorks");

  return (
    <section id="how-it-works" className="relative py-20 overflow-hidden">
      {/* Dark luxury wave band */}
      <div className="absolute inset-0 bg-charcoal" />
      <div className="absolute top-0 inset-x-0">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,0 L0,0 Z" fill="white"/>
        </svg>
      </div>
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-light mb-2">{t("eyebrow")}</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-white/30 z-10" />
              )}
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-md">
                <span className="text-gold-deep font-black text-lg">{step.num}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={open}
            className="bg-terra hover:bg-terra-dark text-ink font-bold rounded-full px-8 py-4 text-base transition-all hover:shadow-lg hover:-translate-y-px"
          >
            {t("cta")}
          </button>
        </div>
      </div>
    </section>
  );
}
