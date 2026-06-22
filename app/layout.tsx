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
    default: "MAK Painting Group | Premium Melbourne Painters",
    template: "%s | MAK Painting Group",
  },
  description:
    "Melbourne's trusted residential & commercial painters. Free on-site quotes, premium prep, flawless finish, 7-year workmanship warranty. 500+ homes painted.",
  keywords: [
    "painters Melbourne",
    "house painting Melbourne",
    "interior painters",
    "exterior painters",
    "commercial painters Melbourne",
    "roof painting Melbourne",
  ],
  openGraph: {
    title: "MAK Painting Group | Premium Melbourne Painters",
    description:
      "Stress-free painting you can depend on. Free quote, premium prep, 7-year warranty.",
    type: "website",
    locale: "en_AU",
    siteName: "MAK Painting Group",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.makpainting.com.au",
  name: "MAK Painting Group",
  description:
    "Premium residential and commercial painting services across Melbourne, Victoria.",
  url: "https://www.makpainting.com.au",
  telephone: "0404 000 772",
  email: "hello@makpainting.com.au",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Melbourne",
    addressRegion: "VIC",
    addressCountry: "AU",
  },
  areaServed: { "@type": "City", name: "Melbourne" },
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "200",
    bestRating: "5",
  },
  sameAs: [
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
