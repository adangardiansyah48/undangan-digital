import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Auth" }, { status: 401 });

  const { data: inv } = await supabase.from("invitations").select("id,user_id,slug").eq("id", id).single();
  if (!inv || inv.user_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const admin = createAdminClient();
  const { data: items } = await admin.from("gallery_items").select("id,drive_file_id,r2_key").eq("invitation_id", id);
  const driveIds = (items ?? []).map((x) => (x as unknown as { drive_file_id: string | null }).drive_file_id).filter(Boolean) as string[];
  const r2Keys = (items ?? []).map((x) => (x as unknown as { r2_key: string | null }).r2_key).filter(Boolean) as string[];

  if (driveIds.length) {
    try {
      const mod = await import("@/lib/gdrive");
      await mod.trashFilesByIds(driveIds, user.id).catch(() => {});
      const folderId = await mod.ensureInvitationFolder(user.id, inv.slug).catch(() => null);
      if (folderId) await mod.trashFolder(folderId, user.id).catch(() => {});
    } catch {}
  }
  if (r2Keys.length) {
    try {
      const { r2Delete } = await import("@/lib/r2");
      await r2Delete(r2Keys).catch(() => {});
    } catch {}
  }

  await admin.from("gallery_items").delete().eq("invitation_id", id);
  await admin.from("analytics").delete().eq("invitation_id", id);
  await admin.from("guests").delete().eq("invitation_id", id);
  await admin.from("wishes").delete().eq("invitation_id", id);
  await admin.from("invitations").delete().eq("id", id);

  return NextResponse.json({ ok: true, files: driveIds.length + r2Keys.length });
}
