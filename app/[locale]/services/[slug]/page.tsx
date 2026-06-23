import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SERVICES } from "@/data/site";
import { ContactSection } from "@/components/ContactSection";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SERVICES.map((s) => ({ locale, slug: s.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return {};
  const base = "https://www.makpainting.com.au";
  return {
    title: s.metaTitle,
    description: s.metaDesc,
    alternates: {
      canonical: `${base}/${locale}/services/${slug}`,
      languages: { en: `${base}/en/services/${slug}`, fa: `${base}/fa/services/${slug}`, "x-default": `${base}/en/services/${slug}` },
    },
    openGraph: {
      title: s.metaTitle,
      description: s.metaDesc,
      url: `${base}/${locale}/services/${slug}`,
      type: "website",
      images: [{ url: `${base}${s.image.startsWith("/") ? s.image : "/og-image.jpg"}`, width: 1200, height: 630, alt: s.title }],
    },
  };
}

const LABELS = {
  en: {
    back: "Back to services",
    included: "What's included",
    ready: "Ready to get started?",
    readyBody: "Get a free, no-obligation on-site quote. We respond within one business day.",
    quoteFor: (s: string) => `Get a free quote for ${s.toLowerCase()}`,
    call: "Call us: 0404 000 772",
    warranty: "7-year workmanship warranty on all work",
  },
  fa: {
    back: "بازگشت به خدمات",
    included: "آنچه شامل می‌شود",
    ready: "آماده‌اید شروع کنید؟",
    readyBody: "قیمت‌گذاری رایگان و بدون تعهد در محل بگیرید. ظرف یک روز کاری پاسخ می‌دهیم.",
    quoteFor: (s: string) => `دریافت قیمت رایگان برای ${s}`,
    call: "تماس: ۰۴۰۴ ۰۰۰ ۷۷۲",
    warranty: "۷ سال گارانتی کیفیت کار روی تمام کارها",
  },
} as const;

export default async function ServicePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();
  const L = LABELS[locale === "fa" ? "fa" : "en"];

  const base = "https://www.makpainting.com.au";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${base}/${locale}/services` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${base}/${locale}/services/${service.slug}` },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `${base}/${locale}/services/${service.slug}`,
    image: `${base}${service.image}`,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${base}/#business`,
      name: "MAK Painting Group",
      telephone: "+61404000772",
      address: { "@type": "PostalAddress", addressLocality: "Ferntree Gully", addressRegion: "VIC", postalCode: "3156", addressCountry: "AU" },
    },
    areaServed: "Melbourne",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="pt-16 bg-canvas min-h-screen">
        {/* Hero */}
        <div className="relative h-72 lg:h-96 overflow-hidden">
          <Image src={service.image} alt={service.title} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 to-charcoal/30" />
          <div className="absolute inset-0 flex items-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div>
              <Link href="/services" className="text-xs text-white/60 font-semibold mb-3 flex items-center gap-1.5 hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5 rtl-flip" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {L.back}
              </Link>
              <p className="text-terra text-xs font-bold uppercase tracking-widest mb-2">{service.priceFrom}</p>
              <h1 className="text-4xl lg:text-5xl font-black text-white">{service.title}</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
            <div>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">{service.description}</p>
              <h2 className="text-2xl font-black text-charcoal mb-4">{L.included}</h2>
              <ul className="grid sm:grid-cols-2 gap-3 mb-10">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-card">
                    <span className="w-5 h-5 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-ink" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="text-sm font-semibold text-charcoal">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card-lg p-6 sticky top-24">
              <h3 className="font-black text-xl text-charcoal mb-2">{L.ready}</h3>
              <p className="text-sm text-gray-500 mb-5">{L.readyBody}</p>
              <Link href="/contact" className="block w-full bg-terra hover:bg-terra-dark text-ink font-bold rounded-xl py-4 text-center text-sm transition-colors mb-3">
                {L.quoteFor(service.title)}
              </Link>
              <a href="tel:0404000772" className="block w-full border-2 border-blue-brand text-gold-deep font-bold rounded-xl py-3.5 text-center text-sm hover:bg-blue-muted transition-colors" dir="ltr">
                {L.call}
              </a>
              <p className="text-xs text-gray-400 text-center mt-3">{L.warranty}</p>
            </div>
          </div>
        </div>

        <ContactSection />
      </div>
    </>
  );
}
