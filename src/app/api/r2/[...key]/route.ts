import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key: parts } = await params;
  const key = (parts ?? []).join("/");
  if (!key.startsWith("invitations/")) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ctx = await getCloudflareContext() as unknown as { env: Record<string, unknown> };
  const bucket = ctx.env?.INVITATION_R2 as unknown as {
    get(k: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer>; httpMetadata?: { contentType?: string }; etag?: string } | null>;
  } | undefined;
  if (!bucket) return NextResponse.json({ error: "R2 not configured" }, { status: 503 });

  const obj = await bucket.get(key);
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buf = await obj.arrayBuffer();
  return new NextResponse(buf, {
    headers: {
      "content-type": obj.httpMetadata?.contentType ?? "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
      etag: (obj as unknown as { etag?: string }).etag ?? "",
    },
  });
}
