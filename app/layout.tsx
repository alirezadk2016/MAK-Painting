import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.makpainting.com.au"),
  title: {
    default: "MAK Painting Group | Painters Melbourne – 5★ Rated",
    template: "%s | MAK Painting Group Melbourne",
  },
  description:
    "MAK Painting Group – Melbourne's 5-star rated painters. Interior, exterior, roof & commercial painting. Free on-site quotes, premium prep, 7-year warranty. Call 0404 000 772.",
  keywords: [
    "painters Melbourne",
    "painting services Melbourne",
    "house painting Melbourne",
    "interior painters Melbourne",
    "exterior painters Melbourne",
    "roof painting Melbourne",
    "commercial painters Melbourne",
    "local painters near me",
    "residential painters Melbourne",
    "cheap painters Melbourne",
    "best painters Melbourne",
    "painting contractor Melbourne",
  ],
  alternates: {
    canonical: "https://www.makpainting.com.au",
  },
  openGraph: {
    title: "MAK Painting Group | 5★ Painters Melbourne",
    description:
      "Melbourne's trusted painting specialists. Interior, exterior, roof & commercial. Free on-site quote. 7-year warranty. 5.0★ on Google.",
    type: "website",
    url: "https://www.makpainting.com.au",
    locale: "en_AU",
    siteName: "MAK Painting Group",
  },
  twitter: { card: "summary_large_image", title: "MAK Painting Group | 5★ Painters Melbourne" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: {},
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "PaintingContractor",
  "@id": "https://www.makpainting.com.au/#business",
  name: "MAK Painting Group",
  description:
    "Professional residential and commercial painting services across Melbourne, Victoria. Interior, exterior, roof painting and special finishes.",
  url: "https://www.makpainting.com.au",
  telephone: "+61404000772",
  email: "hello@makpainting.com.au",
  image: "https://www.makpainting.com.au/og-image.jpg",
  logo: "https://www.makpainting.com.au/logo.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Melbourne",
    addressRegion: "VIC",
    postalCode: "3000",
    addressCountry: "AU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -37.9725665,
    longitude: 145.0531353,
  },
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
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "07:00", closes: "16:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "14:00" },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "7",
    bestRating: "5",
    worstRating: "1",
  },
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Jessica Lewis" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody: "Mak Painting was extremely professional and completed the work in a timely manner. The quality of work exceeded my expectations and the eye for detail was impeccable.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Debbie Bumpstead" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody: "Very pleased with the painting of my ceilings inside & carport ceiling. A very efficient painter with no mess, came on the time arranged. Excellent price. I wouldn't go anywhere else.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Emma Hulst" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody: "Highly recommend! Extremely efficient, reliable and professional. Communication was excellent from start to finish and the quality of work was outstanding.",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Painting Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Interior Painting", url: "https://www.makpainting.com.au/services/interior" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Exterior Painting", url: "https://www.makpainting.com.au/services/exterior" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Roof Painting", url: "https://www.makpainting.com.au/services/roof" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Commercial Painting", url: "https://www.makpainting.com.au/services/commercial" } },
    ],
  },
  sameAs: [
    "https://www.google.com/maps/place/MAK+Painting+Group/@-37.9725665,145.0531353,17z",
    "https://facebook.com/makpaintinggroup",
    "https://instagram.com/makpaintinggroup",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={manrope.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <QuoteWizardProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
          <MobileStickyBar />
          <CookieBanner />
        </QuoteWizardProvider>
      </body>
    </html>
  );
}
