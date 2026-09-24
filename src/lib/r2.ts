import { getCloudflareContext } from "@opennextjs/cloudflare";

type R2Bucket = {
  put(key: string, value: ArrayBuffer | Uint8Array | string, opts?: { httpMetadata?: { contentType?: string; cacheControl?: string }; customMetadata?: Record<string, string> }): Promise<unknown>;
  get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer>; httpMetadata?: { contentType?: string } } | null>;
  delete(keys: string | string[]): Promise<void>;
  list(opts?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ objects: { key: string }[]; truncated: boolean; cursor?: string }>;
};

function getR2Sync(): R2Bucket | null {
  try {
    const maybe = getCloudflareContext() as unknown as { env: Record<string, unknown> } | Promise<{ env: Record<string, unknown> }>;
    if (maybe && typeof (maybe as Promise<unknown>).then === "function") return null;
    const b = (maybe as { env: Record<string, unknown> }).env?.INVITATION_R2 as unknown as R2Bucket | undefined;
    if (b && typeof b.put === "function") return b;
  } catch {}
  const g = globalThis as unknown as { INVITATION_R2?: R2Bucket };
  if (g.INVITATION_R2) return g.INVITATION_R2;
  return null;
}

async function getR2Async(): Promise<R2Bucket | null> {
  try {
    const ctx = (await getCloudflareContext()) as unknown as { env: Record<string, unknown> };
    const b = ctx.env?.INVITATION_R2 as unknown as R2Bucket | undefined;
    if (b && typeof b.put === "function") return b;
  } catch {}
  return getR2Sync();
}

function getR2(): R2Bucket | null {
  return getR2Sync();
}

export function r2Key(invitationId: string, ext: string, kind: "gallery" | "cover" = "gallery") {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `invitations/${invitationId}/${kind}/${id}.${ext}`;
}

export async function r2Put(key: string, buf: Uint8Array, contentType: string) {
  const bucket = (await getR2Async()) ?? getR2Sync();
  if (!bucket) throw new Error("R2 INVITATION_R2 belum dikonfigurasi. Aktifkan R2 dan binding di Cloudflare Dashboard lalu deploy ulang.");
  await bucket.put(key, buf, {
    httpMetadata: { contentType, cacheControl: "public, max-age=31536000, immutable" },
  });
  return key;
}

export async function r2Delete(keys: string[]) {
  if (!keys.length) return;
  const bucket = (await getR2Async()) ?? getR2Sync();
  if (!bucket) return;
  const chunk = 1000;
  for (let i = 0; i < keys.length; i += chunk) {
    await bucket.delete(keys.slice(i, i + chunk));
  }
}

export async function r2ListByInvitation(invitationId: string): Promise<string[]> {
  const bucket = (await getR2Async()) ?? getR2Sync();
  if (!bucket) return [];
  const prefix = `invitations/${invitationId}/`;
  const keys: string[] = [];
  let cursor: string | undefined;
  do {
    const res = await bucket.list({ prefix, cursor });
    for (const o of res.objects) keys.push(o.key);
    cursor = res.truncated ? res.cursor : undefined;
  } while (cursor);
  return keys;
}

export function r2PublicUrl(key: string) {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (base) return `${base}/${key}`;
  return `/api/r2/${key}`;
}
