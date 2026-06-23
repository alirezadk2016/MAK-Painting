import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Services } from "@/components/Services";
import { Extras } from "@/components/Extras";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { PageHeader } from "@/components/PageHeader";

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
    alternates: { canonical: `https://www.makvandi.info/${locale}/services` },
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
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <Services />
      <Extras />
      <HowItWorks />
      <Pricing />
    </>
  );
}
