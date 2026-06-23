import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { WhyMAK } from "@/components/WhyMAK";
import { Reviews } from "@/components/Reviews";
import { PageHeader } from "@/components/PageHeader";
import { AboutCTA } from "@/components/AboutCTA";
import { STATS } from "@/data/site";

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
    alternates: { canonical: `https://www.makpainting.com.au/${locale}/about` },
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
          <p className="text-gray-600 leading-relaxed">{t("storyBody")}</p>
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
