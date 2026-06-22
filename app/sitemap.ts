import type { MetadataRoute } from "next";
import { SERVICES } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.makpainting.com.au";
  const serviceRoutes = SERVICES.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...serviceRoutes,
  ];
}
