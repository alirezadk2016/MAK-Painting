import type { MetadataRoute } from "next";
import { SERVICES } from "@/data/site";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.makpainting.com.au";
  const pages = ["", "/services", "/about", "/gallery", "/contact"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const page of pages) {
      entries.push({
        url: `${base}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${base}/${l}${page}`])
          ),
        },
      });
    }
    for (const s of SERVICES) {
      entries.push({
        url: `${base}/${locale}/services/${s.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${base}/${l}/services/${s.slug}`])
          ),
        },
      });
    }
  }
  return entries;
}
