import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "MAK Painting Group | Painters Melbourne – 5★ Rated",
  description:
    "MAK Painting Group – Melbourne's 5-star rated painters. Interior, exterior, roof & commercial painting. Free on-site quote. 7-year warranty. Call 0404 000 772.",
  alternates: { canonical: "https://www.makpainting.com.au" },
  openGraph: {
    title: "MAK Painting Group | 5★ Painters Melbourne",
    description: "Melbourne's trusted painting specialists. Interior, exterior, roof & commercial. Free on-site quote. 5.0★ on Google.",
    url: "https://www.makpainting.com.au",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
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
