import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { Extras } from "@/components/Extras";
import { WhyMAK } from "@/components/WhyMAK";
import { Gallery } from "@/components/Gallery";
import { ColorInspiration } from "@/components/ColorInspiration";
import { Reviews } from "@/components/Reviews";
import { ServiceAreas } from "@/components/ServiceAreas";
import { FAQ } from "@/components/FAQ";
import { ContactSection } from "@/components/ContactSection";
import { FAQS } from "@/data/site";
import { canonicalAlternates, pageOG, pageTwitter } from "@/lib/seo";
import { getSiteConfig, DEFAULT_PRICING } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.home" });
  return {
    alternates: canonicalAlternates("", locale),
    openGraph: pageOG({ title: t("title"), description: t("description"), path: "", locale }),
    twitter: pageTwitter({ title: t("title"), description: t("description") }),
  };
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const siteConfig = await getSiteConfig();
  const pricingTiers = siteConfig?.pricing?.length ? siteConfig.pricing : DEFAULT_PRICING;
  const serviceCards = siteConfig?.serviceCards;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Hero heroImage={siteConfig?.hero} />
      <Services cards={serviceCards} />
      <HowItWorks />
      <Pricing tiers={pricingTiers} />
      <Extras />
      <WhyMAK />
      <Gallery />
      <ColorInspiration />
      <Reviews />
      <ServiceAreas />
      <FAQ />
      <ContactSection />
    </>
  );
}
