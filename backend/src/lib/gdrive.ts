import { google } from "googleapis";
import { supabaseAdmin } from "./supabase.js";

function oauth() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export function gdriveAuthUrl(state: string) {
  return oauth().generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive.file"],
    state,
  });
}

export async function exchangeCode(code: string) {
  const { tokens } = await oauth().getToken(code);
  return tokens;
}

export async function saveTokens(userId: string, tokens: { access_token?: string | null; refresh_token?: string | null; expiry_date?: number | null }) {
  if (!tokens.access_token || !tokens.refresh_token) throw new Error("token incomplete");
  const sb = supabaseAdmin();
  const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : new Date(Date.now() + 3600 * 1000).toISOString();
  const { error } = await sb.from("gdrive_tokens").upsert(
    { user_id: userId, access_token: tokens.access_token, refresh_token: tokens.refresh_token, expires_at: expiresAt },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

async function driveFor(userId: string) {
  const sb = supabaseAdmin();
  const { data: tok, error } = await sb.from("gdrive_tokens").select("*").eq("user_id", userId).single();
  if (error || !tok) throw new Error("gdrive not connected");
  const c = oauth();
  c.setCredentials({ access_token: tok.access_token, refresh_token: tok.refresh_token, expiry_date: new Date(tok.expires_at).getTime() });
  c.on("tokens", async (fresh) => {
    await sb.from("gdrive_tokens").update({
      access_token: fresh.access_token ?? tok.access_token,
      refresh_token: fresh.refresh_token ?? tok.refresh_token,
      expires_at: fresh.expiry_date ? new Date(fresh.expiry_date).toISOString() : tok.expires_at,
    }).eq("user_id", userId);
  });
  return google.drive({ version: "v3", auth: c });
}

export async function ensureFolder(userId: string, name: string, parentId?: string) {
  const drive = await driveFor(userId);
  const q = [`name = '${name.replace(/'/g, "\\'")}'`, "mimeType = 'application/vnd.google-apps.folder'", "trashed = false", parentId ? `'${parentId}' in parents` : undefined].filter(Boolean).join(" and ");
  const found = await drive.files.list({ q, fields: "files(id,name)", pageSize: 1 });
  if (found.data.files?.[0]?.id) return found.data.files[0].id!;
  const created = await drive.files.create({ requestBody: { name, mimeType: "application/vnd.google-apps.folder", parents: parentId ? [parentId] : undefined }, fields: "id" });
  return created.data.id!;
}

export async function uploadBuffer(userId: string, file: { buffer: Buffer; filename: string; mimeType: string }, folderId: string) {
  const drive = await driveFor(userId);
  const { Readable } = await import("stream");
  const res = await drive.files.create({
    requestBody: { name: file.filename, parents: [folderId] },
    media: { mimeType: file.mimeType, body: Readable.from(file.buffer) },
    fields: "id,name,webViewLink",
  });
  if (res.data.id) await drive.permissions.create({ fileId: res.data.id, requestBody: { role: "reader", type: "anyone" } });
  return res.data;
}

export function driveUrl(id: string) {
  return `https://drive.google.com/uc?export=view&id=${id}`;
}
