import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { AboutCTA } from "@/components/AboutCTA";
import { canonicalAlternates, pageOG, pageTwitter } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = "Our Promise to You — We Protect Your Home | MAK Painting Group";
  const description = "Before a single brushstroke, we cover every floor, carpet, piece of furniture and fixture with drop sheets and plastic. Your home is treated with the same care as ours.";
  return {
    title,
    description,
    keywords: ["MAK Painting Group protection", "furniture protection painting Melbourne", "clean painters Melbourne", "no mess painters", "drop sheet painters"],
    alternates: canonicalAlternates("/our-promise", locale),
    openGraph: pageOG({ title, description, path: "/our-promise", locale }),
    twitter: pageTwitter({ title, description }),
  };
}

const steps = [
  {
    icon: "🛡️",
    title: "Full floor & carpet protection",
    body: "Every floor surface — timber, carpet, tiles — is covered with heavy-duty drop sheets before we move a single tool into the room. Nothing touches your flooring unprotected.",
  },
  {
    icon: "📦",
    title: "Furniture wrapped & moved safely",
    body: "We move light furniture to the centre of the room and wrap it in plastic sheeting. Large, heavy items are covered in-place with professional dust sheets rated for paint splatter.",
  },
  {
    icon: "🪟",
    title: "Doors, windows & trims masked",
    body: "We use multi-surface masking tape and precision-cut paper to protect all handles, glass, light switches, power points and architraves from overspray and roller splash.",
  },
  {
    icon: "🚿",
    title: "Bathroom & wet areas sealed",
    body: "Toilets, vanities, mirrors and tiles are individually wrapped. We place absorbent mats in front of entry points so paint residue is never tracked through your home.",
  },
  {
    icon: "🧹",
    title: "End-of-day tidy-up — every day",
    body: "At the end of each working day, we collect all tape, masking paper, used brushes and empty tins. You will never go to bed with your home looking like a building site.",
  },
  {
    icon: "✅",
    title: "Full clean-up on completion",
    body: "On the final day we remove all protection, wipe down surfaces, touch up any accidental marks outside the work zone and leave your property cleaner than we found it.",
  },
];

export default async function OurPromisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader
        eyebrow="Our promise to you"
        title="We treat your home like our own"
      />

      {/* Hero statement */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg lg:text-xl text-charcoal leading-relaxed font-medium mb-12 text-balance">
            Before a single brushstroke is applied, our team covers every floor, carpet, piece of furniture, fixture and fitting with drop sheets and plastic sheeting. We believe a great paint job means leaving your home <em>cleaner</em> than we arrived — not just painted.
          </p>

          {/* Bathroom protection photo */}
          <div className="relative rounded-2xl overflow-hidden aspect-video mb-12 shadow-card">
            <Image
              src="/bathroom-protection.jpg"
              alt="MAK Painting team protecting bathroom fixtures before painting"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent flex items-end p-6">
              <p className="text-white font-semibold text-sm">
                Every surface — including toilets, vanities and tiles — is individually wrapped before work begins.
              </p>
            </div>
          </div>

          {/* Steps grid */}
          <h2 className="text-2xl lg:text-3xl font-black text-charcoal mb-8">
            Our 6-step protection process
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {steps.map((step, i) => (
              <div key={i} className="bg-canvas rounded-2xl p-6 border border-gold/10">
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-black text-charcoal mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          {/* Guarantee banner */}
          <div className="bg-charcoal rounded-2xl p-8 text-center">
            <p className="text-gold font-black text-lg mb-2">Our zero-damage guarantee</p>
            <p className="text-white/80 text-sm leading-relaxed max-w-xl mx-auto">
              If anything in your home is damaged due to our negligence, we fix or replace it — full stop. We carry $20M public liability insurance and stand behind every job we complete.
            </p>
          </div>
        </div>
      </section>

      <AboutCTA
        title="Ready for a stress-free paint job?"
        body="Get a free on-site quote from Melbourne's most careful painters."
        button="Get a free quote"
      />
    </>
  );
}
