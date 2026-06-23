import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { WhyMAK } from "@/components/WhyMAK";
import { Reviews } from "@/components/Reviews";
import { PageHeader } from "@/components/PageHeader";
import { AboutCTA } from "@/components/AboutCTA";
import { STATS } from "@/data/site";
import { canonicalAlternates, pageOG, pageTwitter } from "@/lib/seo";

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
  const t = await getTranslations("AboutPage");

  const values = [
    { title: t("value1Title"), body: t("value1Body") },
    { title: t("value2Title"), body: t("value2Body") },
    { title: t("value3Title"), body: t("value3Body") },
    { title: t("value4Title"), body: t("value4Body") },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} />

      {/* Intro + story */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg lg:text-xl text-charcoal leading-relaxed font-medium mb-12 text-balance">
            {t("intro")}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
            {STATS.map((s) => (
              <div key={s.label} className="bg-canvas rounded-2xl p-5 text-center border border-gold/10">
                <p className="text-3xl font-black text-gold-deep">
                  {s.num}
                  {s.suffix}
                </p>
                <p className="text-xs text-gray-500 font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-charcoal mb-4">{t("storyTitle")}</h2>
          <p className="text-gray-600 leading-relaxed mb-10">{t("storyBody")}</p>

          {/* Project photos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { src: "/car.png", alt: "MAK Painting Group van" },
              { src: "/living-room-after.jpg", alt: "Interior painting Melbourne" },
              { src: "/kitchen-after.jpg", alt: "Kitchen cabinet painting Melbourne" },
              { src: "/bedroom-pink-after.jpg", alt: "Bedroom painting Melbourne" },
              { src: "/deck-after.jpg", alt: "Deck painting Melbourne" },
              { src: "/exterior-terrace.jpg", alt: "Exterior painting Melbourne" },
            ].map((img) => (
              <div key={img.src} className="relative aspect-square rounded-2xl overflow-hidden">
                <Image src={img.src} alt={img.alt} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-20 bg-canvas">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-black text-charcoal text-center mb-12">{t("valuesTitle")}</h2>
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
      <AboutCTA title={t("ctaTitle")} body={t("ctaBody")} button={t("ctaButton")} />
    </>
  );
}
