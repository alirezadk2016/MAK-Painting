const CONFIG_KEY = "site:config-v2";

export interface GalleryPair {
  id: number;
  title: string;
  before: string;
  after: string;
}

export interface PricingTier {
  id: string;
  name: string;
  desc: string;
  popular: boolean;
  priceLabel: string;
  features: string[];
}

export interface SiteConfig {
  hero: string;
  services: Record<string, string>;
  gallery: GalleryPair[];
  pricing: PricingTier[];
}

// Keep old type alias so existing imports don't break
export type MediaConfig = SiteConfig;

export const DEFAULT_PRICING: PricingTier[] = [
  {
    id: "residential",
    name: "Residential",
    desc: "Interior & exterior painting for homes and apartments.",
    popular: false,
    priceLabel: "Pricing coming soon",
    features: [
      "Full surface preparation",
      "Premium Dulux / Taubmans paints",
      "2–3 coat system",
      "Furniture & floor protection",
      "Same-day clean-up",
      "7-year workmanship warranty",
    ],
  },
  {
    id: "full-repaint",
    name: "Full Repaint",
    desc: "Complete transformation — the most popular choice.",
    popular: true,
    priceLabel: "Pricing coming soon",
    features: [
      "Whole house (walls, ceilings & trims)",
      "Premium 2–3 coat system",
      "Full prep + minor repairs",
      "Colour consultation included",
      "Priority scheduling",
      "7-year workmanship warranty",
    ],
  },
  {
    id: "commercial",
    name: "Commercial",
    desc: "Offices, strata complexes & industrial facilities.",
    popular: false,
    priceLabel: "Pricing coming soon",
    features: [
      "Flexible night & weekend scheduling",
      "OH&S compliant crew",
      "Strata & body corporate experience",
      "Project management included",
      "Contract work accepted",
      "Certificate of insurance on request",
    ],
  },
];

function hasKV(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getKV() {
  if (!hasKV()) throw new Error("Vercel KV is not configured");
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function getSiteConfig(): Promise<SiteConfig | null> {
  if (!hasKV()) return null;
  try {
    const kv = await getKV();
    return kv.get<SiteConfig>(CONFIG_KEY);
  } catch {
    return null;
  }
}

export async function setSiteConfig(config: SiteConfig): Promise<void> {
  if (!hasKV()) return;
  const kv = await getKV();
  await kv.set(CONFIG_KEY, config);
}

// Back-compat aliases
export const getMediaConfig = getSiteConfig;
export const setMediaConfig = setSiteConfig;
