import type { MetadataRoute } from "next";
import { SERVICES } from "@/data/site";
import { routing } from "@/i18n/routing";

const base = "https://www.makvandi.info";

function langs(path: string) {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}${path}`])),
    "x-default": `${base}/en${path}`,
  };
}

// Use a stable date so sitemap doesn't report all pages as modified on every deploy
const LAST_MODIFIED = new Date("2025-06-23");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = LAST_MODIFIED;
  const entries: MetadataRoute.Sitemap = [];

  const pages: [string, number, MetadataRoute.Sitemap[0]["changeFrequency"]][] = [
    ["", 1.0, "weekly"],
    ["/services", 0.9, "monthly"],
    ["/about", 0.8, "monthly"],
    ["/gallery", 0.8, "monthly"],
    ["/contact", 0.9, "monthly"],
  ];

  for (const locale of routing.locales) {
    for (const [path, priority, freq] of pages) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: freq,
        priority,
        alternates: { languages: langs(path) },
      });
    }
    for (const s of SERVICES) {
      entries.push({
        url: `${base}/${locale}/services/${s.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: { languages: langs(`/services/${s.slug}`) },
      });
    }
  }

  return entries;
}
