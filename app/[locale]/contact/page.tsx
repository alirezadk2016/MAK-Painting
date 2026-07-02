import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ContactSection } from "@/components/ContactSection";
import { ServiceAreas } from "@/components/ServiceAreas";
import { FAQ } from "@/components/FAQ";
import { PageHeader } from "@/components/PageHeader";
import { canonicalAlternates, pageOG, pageTwitter } from "@/lib/seo";

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: "https://www.makvandi.info/en/contact",
  name: "Contact MAK Painting Group — Free Quote Melbourne",
  description: "Get a free on-site painting quote from MAK Painting Group. Call 0404 000 772 or fill in the form.",
  mainEntity: {
    "@type": "PaintingContractor",
    "@id": "https://www.makvandi.info/#business",
    telephone: "+61404000772",
    email: "mak.painting.group@gmail.com",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.contact" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: ["free painting quote Melbourne", "contact MAK Painting", "painter phone number Melbourne", "painting quote request", "0404 000 772"],
    alternates: canonicalAlternates("/contact", locale),
    openGraph: pageOG({ title: t("title"), description: t("description"), path: "/contact", locale }),
    twitter: pageTwitter({ title: t("title"), description: t("description") }),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ContactPage");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <ContactSection />
      <ServiceAreas />
      <FAQ />
    </>
  );
}
