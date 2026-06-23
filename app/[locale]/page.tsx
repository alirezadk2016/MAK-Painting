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
import { canonicalAlternates, pageOG, pageTwitter } from "@/lib/seo";
import { getSiteConfig, DEFAULT_PRICING, DEFAULT_FAQS } from "@/lib/site-config";

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

// faqSchema is built dynamically after siteConfig loads

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
  const servicesSection = siteConfig?.servicesSection;
  const galleryPairs = siteConfig?.gallery?.length ? siteConfig.gallery : undefined;
  const faqItems = siteConfig?.faqs?.length ? siteConfig.faqs : DEFAULT_FAQS;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Hero heroImage={siteConfig?.hero} heroPosition={siteConfig?.heroPosition} />
      <Services cards={serviceCards} section={servicesSection} />
      <HowItWorks />
      <Pricing tiers={pricingTiers} />
      <Extras />
      <WhyMAK />
      <Gallery pairs={galleryPairs} />
      <ColorInspiration />
      <Reviews />
      <ServiceAreas />
      <FAQ faqs={faqItems} />
      <ContactSection />
    </>
  );
}
