import { setRequestLocale } from "next-intl/server";
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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Hero />
      <Services />
      <HowItWorks />
      <Pricing />
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
