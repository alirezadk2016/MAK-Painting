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

export interface ServiceCard {
  id: string;
  label: string;
  img: string;
  slug?: string;
  short?: string;
  priceFrom?: string;
}

export interface ServicesSection {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface AlbumPhoto {
  id: number;
  src: string;
  caption?: string;
}

export interface AboutContent {
  intro?: string;
  storyTitle?: string;
  storyBody?: string;
  photos?: AlbumPhoto[];
}

export interface HeroPosition {
  x: number;   // 0–100, object-position x%
  y: number;   // 0–100, object-position y%
  scale: number; // 1.0–2.0 zoom
}

export interface SiteConfig {
  hero: string;
  heroPosition?: HeroPosition;
  services: Record<string, string>; // legacy image overrides
  serviceCards?: ServiceCard[];      // admin-managed service card list
  servicesSection?: ServicesSection; // section heading overrides
  gallery: GalleryPair[];
  pricing: PricingTier[];
  faqs?: FaqItem[];
  album?: AlbumPhoto[];
  about?: AboutContent;
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

export const DEFAULT_FAQS: FaqItem[] = [
  { q: "How quickly can you provide a quote?",       a: "We typically provide a free on-site quote within 24–48 hours of your enquiry. For commercial or large projects, allow up to 72 hours for a full itemised quote." },
  { q: "What paint brands do you use?",              a: "We are certified Dulux Accredited painters and also work with Taubmans, Haymes and Wattyl. We always recommend the best product for your specific surface, conditions and budget." },
  { q: "How long does interior paint take to dry?",  a: "Most premium paints are touch-dry in 2–4 hours and ready for a second coat in 4–6 hours. We recommend waiting 24 hours before placing furniture back. Full curing takes around 4 weeks." },
  { q: "What happens if it rains during an exterior job?", a: "We monitor the weather closely and won't apply paint in unsuitable conditions. If unexpected rain interrupts a job, we pause, protect the work and return as soon as conditions allow — at no extra cost to you." },
  { q: "Is surface preparation included in your quote?", a: "Yes, always. Every MAK quote includes full prep: washing, sanding, filling holes and cracks, and priming bare surfaces. We never skip prep — it's what separates a lasting finish from a cheap job." },
  { q: "What does your 7-year warranty cover?",      a: "Our 7-year workmanship warranty covers peeling, flaking, blistering and any other defect caused by application errors. It does not cover damage from impact, flooding or structural movement. If anything isn't right, we return and fix it free of charge." },
  { q: "What are your payment terms?",               a: "We require a 20% deposit upon acceptance of the quote to schedule your job. The remaining balance is due upon completion and your satisfaction. We accept EFT, credit card and cash." },
  { q: "Are you insured and police checked?",        a: "Yes. MAK Painting Group holds a current $20M public liability policy and all team members hold a valid Working With Children Check and police clearance. Certificates are available on request." },
  { q: "Do you do weekend work?",                    a: "Yes. We offer Saturday work at standard rates for residential projects. Sunday and public holiday work is available for commercial clients at a small surcharge. Just let us know your preference when booking." },
  { q: "How do you keep the job site clean?",        a: "We use dust sheets, drop cloths and masking to protect all surfaces. At the end of each day we tidy up, and on completion we do a full clean-up including removing all materials, rubbish and touch-up any accidental marks." },
];

export const DEFAULT_ALBUM_PHOTOS: AlbumPhoto[] = [
  { id: 1, src: "/1.png",                   caption: "MAK Painting Group" },
  { id: 2, src: "/living-room-after.jpg",   caption: "Interior Painting" },
  { id: 3, src: "/kitchen-after.jpg",        caption: "Kitchen Cabinet Painting" },
  { id: 4, src: "/bedroom-pink-after.jpg",   caption: "Bedroom Painting" },
  { id: 5, src: "/deck-after.jpg",           caption: "Deck Painting" },
  { id: 6, src: "/exterior-terrace.jpg",     caption: "Exterior Painting" },
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
