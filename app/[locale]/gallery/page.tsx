import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Gallery } from "@/components/Gallery";
import { ColorInspiration } from "@/components/ColorInspiration";
import { Reviews } from "@/components/Reviews";
import { PageHeader } from "@/components/PageHeader";
import { canonicalAlternates, pageOG, pageTwitter } from "@/lib/seo";
import { getSiteConfig } from "@/lib/site-config";

const galleryJsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  url: "https://www.makvandi.info/en/gallery",
  name: "Painting Gallery — Before & After Projects | MAK Painting Group",
  description: "Before and after painting transformations by MAK Painting Group — interior, exterior, feature walls, door resprays and ceiling repairs across Melbourne.",
  provider: { "@type": "PaintingContractor", "@id": "https://www.makvandi.info/#business" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.gallery" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: ["painting before after Melbourne", "painting gallery", "interior painting results", "exterior painting results", "MAK Painting portfolio"],
    alternates: canonicalAlternates("/gallery", locale),
    openGraph: pageOG({ title: t("title"), description: t("description"), path: "/gallery", locale }),
    twitter: pageTwitter({ title: t("title"), description: t("description") }),
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("GalleryPage");
  const siteConfig = await getSiteConfig();
  const galleryPairs = siteConfig?.gallery?.length ? siteConfig.gallery : undefined;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }} />
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <Gallery hideHeading showAll pairs={galleryPairs} />
      <ColorInspiration />
      <Reviews />
    </>
  );
}
