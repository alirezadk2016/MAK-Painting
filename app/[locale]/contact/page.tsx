import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ContactSection } from "@/components/ContactSection";
import { ServiceAreas } from "@/components/ServiceAreas";
import { FAQ } from "@/components/FAQ";
import { PageHeader } from "@/components/PageHeader";

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
    alternates: { canonical: `https://www.makpainting.com.au/${locale}/contact` },
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
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <ContactSection />
      <ServiceAreas />
      <FAQ />
    </>
  );
}
