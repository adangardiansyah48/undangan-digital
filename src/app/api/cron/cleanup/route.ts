import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { r2Delete, r2ListByInvitation } from "@/lib/r2";

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
    .select("id,slug,expired_at,data")
    .not("expired_at", "is", null)
    .lt("expired_at", nowIso)
    .eq("status", "published")
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!expired?.length) return NextResponse.json({ ok: true, scanned: 0, cleaned: 0 });

  let totalKeys = 0;
  let totalInvs = 0;

  for (const inv of expired) {
    const keysFromItems: string[] = [];
    const { data: items } = await supa.from("gallery_items").select("id,r2_key,url").eq("invitation_id", inv.id);
    for (const it of items ?? []) if (it.r2_key) keysFromItems.push(it.r2_key);

    const bucketKeys = await r2ListByInvitation(inv.id).catch(() => []);
    const allKeys = [...new Set([...keysFromItems, ...bucketKeys])];
    totalKeys += allKeys.length;

    if (dry) continue;

    if (allKeys.length) await r2Delete(allKeys).catch(() => {});
    await supa.from("gallery_items").delete().eq("invitation_id", inv.id);
    await supa.from("analytics").delete().eq("invitation_id", inv.id);
    await supa.from("guests").delete().eq("invitation_id", inv.id);
    await supa.from("wishes").delete().eq("invitation_id", inv.id);
    await supa.from("invitations").delete().eq("id", inv.id);
    totalInvs++;
  }

  return NextResponse.json({ ok: true, scanned: expired.length, keys: totalKeys, cleaned: totalInvs, dry });
}

export async function POST(req: Request) {
  return GET(req);
}
