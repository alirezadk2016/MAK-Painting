"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { SERVICES } from "@/data/site";
import type { ServiceCard, ServicesSection } from "@/lib/site-config";

interface Props {
  cards?: ServiceCard[];
  section?: ServicesSection;
}

const SVC_KEY: Record<string, string> = {
  "interior": "interior", "exterior": "exterior", "roof": "roof",
  "commercial": "commercial", "special-finishes": "specialFinishes", "repaints": "repaints",
};

export function Services({ cards, section }: Props) {
  const t = useTranslations("Services");
  const tData = useTranslations("ServicesData");

  function svcTitle(id: string, fallback: string) {
    const k = SVC_KEY[id];
    return k ? (tData as (k: string) => string)(`${k}.title`) : fallback;
  }
  function svcShort(id: string, fallback: string) {
    const k = SVC_KEY[id];
    return k ? (tData as (k: string) => string)(`${k}.short`) : fallback;
  }

  // Build render list: if admin cards exist use them, else use static SERVICES
  const items = cards?.length
    ? cards.map(c => {
        const match = SERVICES.find(s => s.id === c.id);
        return {
          id: c.id,
          title: svcTitle(c.id, c.label),
          image: c.img,
          slug: c.slug ?? match?.slug,
          // KV-stored short/priceFrom take priority over static data and translations
          short: c.short ?? svcShort(c.id, match?.short ?? ""),
          priceFrom: c.priceFrom ?? match?.priceFrom ?? "",
        };
      })
    : SERVICES.map(s => ({ id: s.id, title: svcTitle(s.id, s.title), image: s.image, slug: s.slug, short: svcShort(s.id, s.short), priceFrom: s.priceFrom }));

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-2">{section?.eyebrow || t("eyebrow")}</p>
          <h2 className="text-4xl lg:text-5xl font-black text-charcoal mb-4">{section?.title || t("title")}</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {section?.subtitle || t("subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              {s.slug ? (
                <Link
                  href={`/services/${s.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <ServiceCardInner s={s} t={t} />
                </Link>
              ) : (
                <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card">
                  <ServiceCardInner s={s} t={t} showLink={false} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCardInner({
  s,
  t,
  showLink = true,
}: {
  s: { title: string; image: string; short: string; priceFrom: string };
  t: ReturnType<typeof useTranslations>;
  showLink?: boolean;
}) {
  return (
    <>
      <div className="relative h-48 overflow-hidden">
        <Image
          src={s.image}
          alt={s.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-4">
          <h3 className="text-white font-black text-xl leading-tight">{s.title}</h3>
        </div>
      </div>
      {(s.short || s.priceFrom || showLink) && (
        <div className="p-5">
          {s.short && <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.short}</p>}
          <div className="flex items-center justify-between">
            {s.priceFrom ? (
              <span className="text-xs font-bold text-gold-deep bg-blue-muted px-3 py-1 rounded-full">
                {s.priceFrom}
              </span>
            ) : <span />}
            {showLink && (
              <span className="text-sm font-bold text-charcoal flex items-center gap-1.5 group-hover:text-gold-deep transition-colors">
                {t("viewService")}
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl-flip" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
