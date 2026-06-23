const CONFIG_KEY = "site:media-config";

export interface MediaConfig {
  hero: string;
  services: Record<string, string>; // serviceId → image URL
  gallery: Array<{ id: number; title: string; before: string; after: string }>;
}

function hasKV(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getKV() {
  if (!hasKV()) throw new Error("Vercel KV is not configured");
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function getMediaConfig(): Promise<MediaConfig | null> {
  if (!hasKV()) return null;
  try {
    const kv = await getKV();
    return kv.get<MediaConfig>(CONFIG_KEY);
  } catch {
    return null;
  }
}

export async function setMediaConfig(config: MediaConfig): Promise<void> {
  if (!hasKV()) return;
  const kv = await getKV();
  await kv.set(CONFIG_KEY, config);
}
