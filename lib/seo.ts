const BASE = "https://www.makvandi.info";
const OG_IMAGE = `${BASE}/opengraph-image`;

export function hreflang(path: string) {
  return {
    en: `${BASE}/en${path}`,
    fa: `${BASE}/fa${path}`,
    "x-default": `${BASE}/en${path}`,
  };
}

export function pageOG(opts: {
  title: string;
  description: string;
  path: string;
  locale: string;
  image?: string;
}) {
  return {
    title: opts.title,
    description: opts.description,
    url: `${BASE}/${opts.locale}${opts.path}`,
    type: "website" as const,
    locale: opts.locale === "fa" ? "fa_IR" : "en_AU",
    siteName: "MAK Painting Group",
    images: [{ url: opts.image ?? OG_IMAGE, width: 1200, height: 630, alt: opts.title }],
  };
}

export function pageTwitter(opts: { title: string; description: string; image?: string }) {
  return {
    card: "summary_large_image" as const,
    title: opts.title,
    description: opts.description,
    images: [opts.image ?? OG_IMAGE],
    site: "@makpaintinggroup",
  };
}

export function canonicalAlternates(path: string, locale: string) {
  return {
    canonical: `${BASE}/${locale}${path}`,
    languages: hreflang(path),
  };
}
