import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { WhyMAK } from "@/components/WhyMAK";
import { Reviews } from "@/components/Reviews";
import { PageHeader } from "@/components/PageHeader";
import { AboutCTA } from "@/components/AboutCTA";
import { STATS } from "@/data/site";
import { canonicalAlternates, pageOG, pageTwitter } from "@/lib/seo";
import { getSiteConfig } from "@/lib/site-config";

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: "https://www.makvandi.info/en/about",
  name: "About MAK Painting Group",
  description: "Dulux Accredited Melbourne painters. Fully insured, 7-year workmanship warranty. Led by Hossain — 5-star rated across Melbourne.",
  mainEntity: {
    "@type": "PaintingContractor",
    "@id": "https://www.makvandi.info/#business",
    name: "MAK Painting Group",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.about" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: ["MAK Painting Group", "about MAK Painting", "Melbourne painters", "Dulux accredited painter Melbourne", "insured painter Melbourne", "Hossain painter"],
    alternates: canonicalAlternates("/about", locale),
    openGraph: pageOG({ title: t("title"), description: t("description"), path: "/about", locale }),
    twitter: pageTwitter({ title: t("title"), description: t("description") }),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, siteConfig] = await Promise.all([
    getTranslations("AboutPage"),
    getSiteConfig().catch(() => null),
  ]);

  const ab = siteConfig?.about;

  const eyebrow     = ab?.eyebrow     || t("eyebrow");
  const pageTitle   = ab?.pageTitle   || t("title");
  const intro       = ab?.intro       || t("intro");
  const storyTitle  = ab?.storyTitle  || t("storyTitle");
  const storyBody   = ab?.storyBody   || t("storyBody");
  const photos      = ab?.photos      ?? [];
  const valuesTitle = ab?.valuesTitle || t("valuesTitle");
  const ctaTitle    = ab?.ctaTitle    || t("ctaTitle");
  const ctaBody     = ab?.ctaBody     || t("ctaBody");
  const ctaButton   = ab?.ctaButton   || t("ctaButton");

  const stats = ab?.stats?.length
    ? ab.stats
    : STATS.map(s => ({ num: String(s.num), suffix: s.suffix, label: s.label }));

  const values = ab?.values?.length
    ? ab.values
    : [
        { title: t("value1Title"), body: t("value1Body") },
        { title: t("value2Title"), body: t("value2Body") },
        { title: t("value3Title"), body: t("value3Body") },
        { title: t("value4Title"), body: t("value4Body") },
      ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <PageHeader eyebrow={eyebrow} title={pageTitle} />

      {/* Intro + story */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg lg:text-xl text-charcoal leading-relaxed font-medium mb-12 text-balance">
            {intro}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
            {stats.map((s, i) => (
              <div key={i} className="bg-canvas rounded-2xl p-5 text-center border border-gold/10">
                <p className="text-3xl font-black text-gold-deep">
                  {s.num}{s.suffix}
                </p>
                <p className="text-xs text-gray-500 font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-charcoal mb-4">{storyTitle}</h2>
          <p className="text-gray-600 leading-relaxed">{storyBody}</p>

          {/* Founder at work */}
          <figure className="mt-10 relative rounded-2xl overflow-hidden shadow-card">
            <div className="relative aspect-[4/3] sm:aspect-[16/10]">
              <Image
                src="/photo_2026-07-02_09-52-32.jpg"
                alt="Hossain, founder of MAK Painting Group, painting on-site in Melbourne"
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
            </div>
            <figcaption className="absolute bottom-0 inset-x-0 p-5">
              <p className="text-white font-black text-lg">Hossain — Founder & Lead Painter</p>
              <p className="text-white/80 text-sm">Hands-on, on every job — bringing 12 years of craftsmanship to your home.</p>
            </figcaption>
          </figure>

          {/* Photo grid */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-12">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.caption ?? "MAK Painting project"}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-20 bg-canvas">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-black text-charcoal text-center mb-12">{valuesTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-charcoal flex items-center justify-center mb-4">
                  <span className="text-gold font-black">{i + 1}</span>
                </div>
                <h3 className="font-black text-lg text-charcoal mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyMAK />
      <Reviews />
      <AboutCTA title={ctaTitle} body={ctaBody} button={ctaButton} />
    </>
  );
}
