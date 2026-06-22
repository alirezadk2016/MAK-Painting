import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/data/site";
import { ContactSection } from "@/components/ContactSection";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDesc,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: "MAK Painting Group",
      address: { "@type": "PostalAddress", addressLocality: "Melbourne", addressRegion: "VIC" },
    },
    areaServed: "Melbourne",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pt-16 bg-canvas min-h-screen">
        {/* Hero */}
        <div className="relative h-72 lg:h-96 overflow-hidden">
          <Image src={service.image} alt={service.title} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 to-charcoal/30" />
          <div className="absolute inset-0 flex items-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div>
              <Link href="/#services" className="text-xs text-white/60 font-semibold mb-3 flex items-center gap-1.5 hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Back to services
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
              <h2 className="text-2xl font-black text-charcoal mb-4">What&apos;s included</h2>
              <ul className="grid sm:grid-cols-2 gap-3 mb-10">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-card">
                    <span className="w-5 h-5 bg-blue-brand rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="text-sm font-semibold text-charcoal">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card-lg p-6 sticky top-24">
              <h3 className="font-black text-xl text-charcoal mb-2">Ready to get started?</h3>
              <p className="text-sm text-gray-500 mb-5">Get a free, no-obligation on-site quote. We respond within one business day.</p>
              <Link href="/#contact" className="block w-full bg-terra hover:bg-terra-dark text-white font-bold rounded-xl py-4 text-center text-sm transition-colors mb-3">
                Get a free quote for {service.title.toLowerCase()}
              </Link>
              <a href="tel:0411234567" className="block w-full border-2 border-blue-brand text-blue-brand font-bold rounded-xl py-3.5 text-center text-sm hover:bg-blue-muted transition-colors">
                Call us: 0411 234 567
              </a>
              <p className="text-xs text-gray-400 text-center mt-3">7-year workmanship warranty on all work</p>
            </div>
          </div>
        </div>

        <ContactSection />
      </div>
    </>
  );
}
