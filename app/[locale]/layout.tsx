import type { Metadata } from "next";
import { Manrope, Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { MobileStickyBar } from "@/components/MobileStickyBar";
import { QuoteWizardProvider } from "@/components/QuoteWizardProvider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.home" });
  const baseUrl = "https://www.makpainting.com.au";
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t("title"),
      template: "%s | MAK Painting Group Melbourne",
    },
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        fa: `${baseUrl}/fa`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}`,
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_AU",
      siteName: "MAK Painting Group",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "MAK Painting Group" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      images: ["/og-image.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "PaintingContractor",
  "@id": "https://www.makpainting.com.au/#business",
  name: "MAK Painting Group",
  description:
    "Professional residential and commercial painting services across Melbourne, Victoria. Interior, exterior, roof painting and special finishes.",
  url: "https://www.makpainting.com.au",
  telephone: "+61404000772",
  email: "mak.painting.group@gmail.com",
  image: "https://www.makpainting.com.au/og-image.jpg",
  logo: "https://www.makpainting.com.au/logo.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ferntree Gully",
    addressRegion: "VIC",
    postalCode: "3156",
    addressCountry: "AU",
  },
  geo: { "@type": "GeoCoordinates", latitude: -37.9725665, longitude: 145.0531353 },
  areaServed: [
    { "@type": "City", name: "Melbourne", "@id": "https://www.wikidata.org/wiki/Q3141" },
    { "@type": "State", name: "Victoria" },
  ],
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: -37.9725665, longitude: 145.0531353 },
    geoRadius: "50000",
  },
  priceRange: "$$",
  currenciesAccepted: "AUD",
  paymentAccepted: "Cash, Credit Card, EFT",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "16:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "14:00" },
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "7", bestRating: "5", worstRating: "1" },
  review: [
    { "@type": "Review", author: { "@type": "Person", name: "Jessica Lewis" }, reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, reviewBody: "Mak Painting was extremely professional and completed the work in a timely manner. The quality of work exceeded my expectations and the eye for detail was impeccable." },
    { "@type": "Review", author: { "@type": "Person", name: "Debbie Bumpstead" }, reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, reviewBody: "Very pleased with the painting of my ceilings inside & carport ceiling. A very efficient painter with no mess, came on the time arranged. Excellent price. I wouldn't go anywhere else." },
    { "@type": "Review", author: { "@type": "Person", name: "Emma Hulst" }, reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }, reviewBody: "Highly recommend! Extremely efficient, reliable and professional. Communication was excellent from start to finish and the quality of work was outstanding." },
  ],
  sameAs: [
    "https://www.google.com/maps/place/MAK+Painting+Group/@-37.9725665,145.0531353,17z",
    "https://facebook.com/makpaintinggroup",
    "https://instagram.com/makpaintinggroup",
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${manrope.variable} ${vazirmatn.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={locale === "fa" ? "font-fa" : ""}>
        <NextIntlClientProvider>
          <QuoteWizardProvider>
            <Nav />
            <main>{children}</main>
            <Footer />
            <MobileStickyBar />
            <CookieBanner />
          </QuoteWizardProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
