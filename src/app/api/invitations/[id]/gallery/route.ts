import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_URL = ["https://", "http://"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Auth" }, { status: 401 });

  const { data: inv } = await supabase
    .from("invitations")
    .select("id,user_id,slug")
    .eq("id", id)
    .single();
  if (!inv || inv.user_id !== user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contentType = request.headers.get("content-type") ?? "";

  let item: { id: string; invitation_id: string; type: "photo" | "video"; url: string; drive_file_id: string | null };

  if (contentType.includes("application/json")) {
    const { url } = (await request.json().catch(() => ({}))) as { url?: string };
    if (!url || !ALLOWED_URL.some((p) => url.startsWith(p)))
      return NextResponse.json({ error: "url tidak valid" }, { status: 400 });
    const { data: row, error } = await supabase
      .from("gallery_items")
      .insert({ invitation_id: id, type: "photo", url })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    item = row as never;
    return NextResponse.json({ item });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "file wajib" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buf = Buffer.from(bytes);

  const hasGdrive = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  let urlForItem: string;
  let driveFileId: string | null = null;

  if (hasGdrive) {
    const { data: token } = await supabase
      .from("gdrive_tokens")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (token) {
      const { ensureFolder, uploadBuffer, driveDirectUrl } = await import("@/lib/gdrive");
      const root = await ensureFolder(user.id, "Invora");
      const invFolder = await ensureFolder(user.id, inv.slug, root);
      const uploaded = await uploadBuffer(
        user.id,
        { buffer: buf, filename: file.name, mimeType: file.type || "image/jpeg" },
        invFolder
      );
      driveFileId = uploaded.id ?? null;
      urlForItem = driveFileId ? driveDirectUrl(driveFileId) : `upload-fallback/${file.name}`;
    } else {
      urlForItem = URL.createObjectURL(new Blob([buf]));
    }
  } else {
    urlForItem = URL.createObjectURL(new Blob([buf]));
  }

  const { data: row, error } = await supabase
    .from("gallery_items")
    .insert({
      invitation_id: id,
      type: file.type.startsWith("video") ? "video" : "photo",
      url: urlForItem,
      drive_file_id: driveFileId,
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  item = row as never;
  return NextResponse.json({ item });
}
