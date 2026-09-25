import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authOk(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const hdr = req.headers.get("authorization") ?? "";
  const q = new URL(req.url).searchParams.get("secret");
  return hdr === `Bearer ${secret}` || q === secret;
}

export async function GET(req: Request) {
  if (!authOk(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const dry = url.searchParams.get("dry") === "1";
  const limit = Math.min(50, Number(url.searchParams.get("limit") ?? "20"));

  const supa = createAdminClient();
  const nowIso = new Date().toISOString();

  const { data: expired, error } = await supa
    .from("invitations")
    .select("id,slug,user_id,expired_at,data")
    .not("expired_at", "is", null)
    .lt("expired_at", nowIso)
    .eq("status", "published")
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!expired?.length) return NextResponse.json({ ok: true, scanned: 0, cleaned: 0 });

  let totalFiles = 0;
  let totalInvs = 0;

  for (const inv of expired) {
    const { data: items } = await supa.from("gallery_items").select("id,drive_file_id,r2_key").eq("invitation_id", inv.id);
    const driveIds = (items ?? []).map((x) => x.drive_file_id).filter(Boolean) as string[];
    const r2Keys = (items ?? []).map((x) => (x as unknown as { r2_key?: string | null }).r2_key).filter(Boolean) as string[];
    totalFiles += driveIds.length + r2Keys.length;

    if (dry) continue;

    if (driveIds.length) {
      try {
        const mod = await import("@/lib/gdrive");
        await mod.trashFilesByIds(driveIds, inv.user_id).catch(() => {});
        const folderId = await mod.ensureInvitationFolder(inv.user_id, inv.slug).catch(() => null);
        if (folderId) await mod.trashFolder(folderId, inv.user_id).catch(() => {});
      } catch {}
    }
    if (r2Keys.length) {
      try {
        const { r2Delete } = await import("@/lib/r2");
        await r2Delete(r2Keys).catch(() => {});
      } catch {}
    }

    await supa.from("gallery_items").delete().eq("invitation_id", inv.id);
    await supa.from("analytics").delete().eq("invitation_id", inv.id);
    await supa.from("guests").delete().eq("invitation_id", inv.id);
    await supa.from("wishes").delete().eq("invitation_id", inv.id);
    await supa.from("invitations").delete().eq("id", inv.id);
    totalInvs++;
  }

  return NextResponse.json({ ok: true, scanned: expired.length, files: totalFiles, cleaned: totalInvs, dry });
}

export async function POST(req: Request) {
  return GET(req);
}
