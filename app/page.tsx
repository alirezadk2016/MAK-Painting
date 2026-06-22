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

export default function HomePage() {
  return (
    <>
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
