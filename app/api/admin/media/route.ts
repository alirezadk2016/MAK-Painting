import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMediaConfig, setMediaConfig, type MediaConfig } from "@/lib/site-config";

async function isAuthed() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === process.env.ADMIN_SECRET;
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config = await getMediaConfig();
  return NextResponse.json({ config });
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config: MediaConfig = await req.json();
  await setMediaConfig(config);
  return NextResponse.json({ ok: true });
}
