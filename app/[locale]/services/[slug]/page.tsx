import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SERVICES } from "@/data/site";
import { ContactSection } from "@/components/ContactSection";
import { routing } from "@/i18n/routing";
import { pageTwitter } from "@/lib/seo";
import { PhotoAlbum } from "@/components/PhotoAlbum";

const SERVICE_PHOTOS: Record<string, { src: string; caption: string }[]> = {
  interior: [
    { src: "/wall-interior-1.jpg",   caption: "Wall Painting" },
    { src: "/wall-interior-2.jpg",   caption: "Wall Painting" },
    { src: "/wall-interior-3.jpg",   caption: "Wall Painting" },
    { src: "/wall-interior-4.jpg",   caption: "Wall Painting" },
    { src: "/wall-interior-5.jpg",   caption: "Wall Painting" },
    { src: "/wall-interior-6.jpg",   caption: "Wall Painting" },
    { src: "/interior-space-1.jpg",  caption: "Interior Space" },
    { src: "/interior-space-2.jpg",  caption: "Interior Space" },
    { src: "/living-room-after.jpg", caption: "Living Room" },
    { src: "/bedroom-pink-after.jpg",caption: "Bedroom" },
    { src: "/kitchen-after.jpg",     caption: "Kitchen" },
    { src: "/hallway-after.jpg",     caption: "Hallway" },
    { src: "/staircase-1.jpg",       caption: "Staircase" },
    { src: "/staircase-2.jpg",       caption: "Staircase" },
    { src: "/staircase-3.jpg",       caption: "Staircase" },
  ],
  exterior: [
    { src: "/exterior-terrace.jpg",   caption: "Exterior" },
    { src: "/exterior-render.jpg",    caption: "Render & Repaint" },
    { src: "/deck-after.jpg",         caption: "Deck" },
    { src: "/deck-exterior-after.jpg",caption: "Exterior Deck" },
    { src: "/pool-area.jpg",          caption: "Pool Area" },
  ],
  roof: [
    { src: "/ceiling-repair-1.jpg", caption: "Ceiling Repair & Paint" },
    { src: "/ceiling-repair-2.jpg", caption: "Ceiling Repair & Paint" },
    { src: "/ceiling-repair-3.jpg", caption: "Ceiling Repair & Paint" },
    { src: "/ceiling-repair-4.jpg", caption: "Ceiling Repair & Paint" },
    { src: "/ceiling-repair-5.jpg", caption: "Ceiling Repair & Paint" },
    { src: "/ceiling-repair-6.jpg", caption: "Ceiling Repair & Paint" },
    { src: "/ceiling-repair-7.jpg", caption: "Ceiling Repair & Paint" },
    { src: "/ceiling-repair-8.jpg", caption: "Ceiling Repair & Paint" },
    { src: "/ceiling-repair-9.jpg", caption: "Ceiling Repair & Paint" },
    { src: "/ceiling-repair-10.jpg",caption: "Ceiling Repair & Paint" },
  ],
  commercial: [
    { src: "/commercial-living-during.jpg", caption: "Commercial Project" },
    { src: "/commercial-prep.jpg",          caption: "Commercial Prep" },
    { src: "/interior-space-1.jpg",         caption: "Interior Space" },
    { src: "/interior-space-2.jpg",         caption: "Interior Space" },
  ],
  "special-finishes": [
    { src: "/feature-wall-lilac.jpg",      caption: "Feature Wall" },
    { src: "/feature-wall-undercoat.jpg",  caption: "Feature Wall" },
    { src: "/wall-interior-5.jpg",         caption: "Wall Finish" },
    { src: "/wall-interior-6.jpg",         caption: "Wall Finish" },
  ],
  repaints: [
    { src: "/door-window-1.jpg", caption: "Door & Window" },
    { src: "/door-window-2.jpg", caption: "Door & Window" },
    { src: "/door-window-3.jpg", caption: "Door & Window" },
    { src: "/door-window-4.jpg", caption: "Door & Window" },
    { src: "/door-window-5.jpg", caption: "Door & Window" },
    { src: "/door-window-6.jpg", caption: "Door & Window" },
    { src: "/door-window-7.jpg", caption: "Door & Window" },
    { src: "/door-window-8.jpg", caption: "Door & Window" },
    { src: "/door-window-9.jpg", caption: "Door & Window" },
    { src: "/wall-interior-7.jpg",  caption: "Wall Repaint" },
    { src: "/wall-interior-8.jpg",  caption: "Wall Repaint" },
    { src: "/wall-interior-9.jpg",  caption: "Wall Repaint" },
    { src: "/wall-interior-10.jpg", caption: "Wall Repaint" },
  ],
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SERVICES.map((s) => ({ locale, slug: s.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return {};
  const base = "https://www.makvandi.info";
  return {
    title: s.metaTitle,
    description: s.metaDesc,
    alternates: {
      canonical: `${base}/${locale}/services/${slug}`,
      languages: { en: `${base}/en/services/${slug}`, fa: `${base}/fa/services/${slug}`, "x-default": `${base}/en/services/${slug}` },
    },
    keywords: [s.title, `${s.title} Melbourne`, "Melbourne painting services", "MAK Painting Group", "Dulux accredited painter"],
    openGraph: {
      title: s.metaTitle,
      description: s.metaDesc,
      url: `${base}/${locale}/services/${slug}`,
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_AU",
      siteName: "MAK Painting Group",
      images: [{ url: `${base}${s.image.startsWith("/") ? s.image : "/og-image.jpg"}`, width: 1200, height: 630, alt: s.title }],
    },
    twitter: pageTwitter({ title: s.metaTitle, description: s.metaDesc, image: `${base}${s.image.startsWith("/") ? s.image : "/og-image.jpg"}` }),
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();
  const t = await getTranslations({ locale, namespace: "ServiceSlugPage" });

  const base = "https://www.makvandi.info";
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
                {t("back")}
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
              <h2 className="text-2xl font-black text-charcoal mb-4">{t("included")}</h2>
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
              <h3 className="font-black text-xl text-charcoal mb-2">{t("ready")}</h3>
              <p className="text-sm text-gray-500 mb-5">{t("readyBody")}</p>
              <Link href="/contact" className="block w-full bg-terra hover:bg-terra-dark text-ink font-bold rounded-xl py-4 text-center text-sm transition-colors mb-3">
                {t("quoteFor", { service: service.title })}
              </Link>
              <a href="tel:0404000772" className="block w-full border-2 border-blue-brand text-gold-deep font-bold rounded-xl py-3.5 text-center text-sm hover:bg-blue-muted transition-colors" dir="ltr">
                {t("call")}
              </a>
              <p className="text-xs text-gray-400 text-center mt-3">{t("warranty")}</p>
            </div>
          </div>
        </div>

        {/* Photo album for this service */}
        {SERVICE_PHOTOS[service.slug]?.length > 0 && (
          <PhotoAlbum
            photos={SERVICE_PHOTOS[service.slug].map((p, i) => ({ id: i + 1, ...p }))}
            title={`${service.title} — Our Work`}
          />
        )}

        <ContactSection />
      </div>
    </>
  );
}
