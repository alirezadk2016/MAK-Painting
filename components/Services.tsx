"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { SERVICES } from "@/data/site";

export function Services() {
  const t = useTranslations("Services");
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">{t("eyebrow")}</p>
          <h2 className="text-4xl lg:text-5xl font-black text-charcoal mb-4">{t("title")}</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                href={`/services/${s.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image with title overlay */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-black text-xl leading-tight">{s.title}</h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.short}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gold-deep bg-blue-muted px-3 py-1 rounded-full">
                      {s.priceFrom}
                    </span>
                    <span className="text-sm font-bold text-charcoal flex items-center gap-1.5 group-hover:text-gold-deep transition-colors">
                      {t("viewService")}
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl-flip" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
