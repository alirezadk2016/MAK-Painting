import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Services } from "@/components/Services";
import { Extras } from "@/components/Extras";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { PageHeader } from "@/components/PageHeader";
import { SERVICES } from "@/data/site";
import { canonicalAlternates, pageOG, pageTwitter } from "@/lib/seo";

const BASE = "https://www.makvandi.info";

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Painting Services Melbourne — MAK Painting Group",
  url: `${BASE}/en/services`,
  itemListElement: SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.title,
      url: `${BASE}/en/services/${s.slug}`,
      provider: { "@type": "PaintingContractor", "@id": `${BASE}/#business` },
    },
  })),
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.services" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: ["painting services Melbourne", "interior painting", "exterior painting", "roof painting Melbourne", "commercial painting Melbourne", "special finishes painter"],
    alternates: canonicalAlternates("/services", locale),
    openGraph: pageOG({ title: t("title"), description: t("description"), path: "/services", locale }),
    twitter: pageTwitter({ title: t("title"), description: t("description") }),
  };
}

export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ServicesPage");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <Services />
      <Extras />
      <HowItWorks />
      <Pricing />
    </>
  );
}
