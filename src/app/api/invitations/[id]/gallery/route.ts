import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { compressImage, extFromMime, isImage, validateUpload } from "@/lib/image";
import { r2Key, r2PublicUrl, r2Put } from "@/lib/r2";

const ALLOWED_URL = ["https://", "http://"];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Auth" }, { status: 401 });

  const { data: inv } = await supabase.from("invitations").select("id,user_id,slug,expired_at,data").eq("id", id).single();
  if (!inv || inv.user_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (inv.expired_at && new Date(inv.expired_at).getTime() <= Date.now()) {
    return NextResponse.json({ error: "Undangan sudah expired, upload ditutup" }, { status: 410 });
  }

  const ct = request.headers.get("content-type") ?? "";

  if (ct.includes("application/json")) {
    const { url } = (await request.json().catch(() => ({}))) as { url?: string };
    if (!url || !ALLOWED_URL.some((p) => url.startsWith(p))) return NextResponse.json({ error: "url tidak valid" }, { status: 400 });
    const { data: row, error } = await supabase
      .from("gallery_items")
      .insert({ invitation_id: id, type: "photo", url, r2_key: null })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ item: row });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "file wajib" }, { status: 400 });

  try {
    validateUpload({ size: file.size, type: file.type, name: file.name });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  const ab = await file.arrayBuffer();
  const buf = Buffer.from(ab);

  let toUpload: Uint8Array = new Uint8Array(buf);
  let mimeOut = file.type || "image/jpeg";
  let ext = extFromMime(mimeOut);

  if (isImage(mimeOut)) {
    const c = await compressImage(buf, mimeOut);
    toUpload = c.buf;
    mimeOut = c.mime;
    ext = c.ext;
  }

  const key = r2Key(id, ext, "gallery");
  try {
    await r2Put(key, toUpload, mimeOut);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const isR2Missing = msg.includes("INVITATION_R2") || msg.includes("R2");
    if (isR2Missing) {
      return NextResponse.json(
        {
          error:
            "R2 belum aktif. Aktifkan R2 di Cloudflare Dashboard (Storage → R2 → Enable), buat bucket invora-invitations, lalu deploy ulang.",
          hint: "Wrangler r2 bucket create invora-invitations + dashboard enable",
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const url = r2PublicUrl(key);
  const type = mimeOut.startsWith("video") ? "video" : "photo";

  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from("gallery_items")
    .insert({ invitation_id: id, type, url, r2_key: key, drive_file_id: null })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: row, compressed: toUpload.length, mime: mimeOut });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Auth" }, { status: 401 });

  const url = new URL(request.url);
  const itemId = url.searchParams.get("itemId");
  if (!itemId) return NextResponse.json({ error: "itemId wajib" }, { status: 400 });

  const { data: inv } = await supabase.from("invitations").select("id,user_id").eq("id", id).single();
  if (!inv || inv.user_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const admin = createAdminClient();
  const { data: item } = await admin.from("gallery_items").select("id,r2_key").eq("id", itemId).eq("invitation_id", id).maybeSingle();
  if (!item) return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });

  const { error } = await admin.from("gallery_items").delete().eq("id", itemId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (item.r2_key) {
    const { r2Delete } = await import("@/lib/r2");
    await r2Delete([item.r2_key]).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
