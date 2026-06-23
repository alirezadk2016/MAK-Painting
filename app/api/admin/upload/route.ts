import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function isAuthed() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === process.env.ADMIN_SECRET;
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP or GIF allowed" }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    // Dev fallback — return a placeholder URL so the UI still works
    return NextResponse.json({ url: `/placeholder-${Date.now()}.jpg`, dev: true });
  }

  const { put } = await import("@vercel/blob");
  const blob = await put(`media/${Date.now()}-${file.name}`, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
