import { Hono } from "hono";
import { cors } from "hono/cors";
import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";

type Env = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  GOOGLE_DRIVE_FOLDER_ID: string;
  FRONTEND_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use("*", async (c, next) => {
  const frontend = c.env?.FRONTEND_URL ?? "https://invora-frontend.pages.dev";
  const middleware = cors({
    origin: [frontend, "http://localhost:5173", "http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });
  return middleware(c, next);
});

function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48);
}
function sbAnon(env: Env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
}
function sbAdmin(env: Env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}
async function userFrom(c: Parameters<Parameters<typeof app.use>[1]>[0] extends never ? never : unknown) {
  return null as never;
}
async function getUser(c: { req: { header: (k: string) => string | undefined }; env: Env }) {
  const h = c.req.header("authorization");
  if (!h?.startsWith("Bearer ")) return null;
  const jwt = h.slice(7);
  const { data } = await sbAdmin(c.env).auth.getUser(jwt);
  return data.user ?? null;
}
function tierAmount(t: string) { const m: Record<string, number> = { bronze: 0, silver: 35000, gold: 65000, platinum: 97000 }; return m[t] ?? 0; }
function tierDays(t: string) { const m: Record<string, number> = { bronze: 2, silver: 10, gold: 30, platinum: 0 }; return m[t] ?? 2; }

app.get("/health", (c) => c.json({ ok: true, version: "cf-0.1.0" }));
app.get("/api/health", (c) => c.json({ ok: true, version: "cf-0.1.0" }));

app.get("/api/templates", async (c) => {
  const cat = c.req.query("cat") ?? "all";
  let q = sbAnon(c.env).from("templates").select("*").eq("is_active", true).order("sort_order");
  if (cat !== "all") q = q.eq("category", cat);
  const { data, error } = await q;
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

app.get("/api/templates/:slug", async (c) => {
  const { data, error } = await sbAnon(c.env).from("templates").select("*").eq("slug", c.req.param("slug")).single();
  if (error) return c.json({ error: error.message }, 404);
  return c.json(data);
});

app.get("/api/invitations/by-slug/:slug", async (c) => {
  const slug = c.req.param("slug");
  const to = c.req.query("to") ?? null;
  const { data, error } = await sbAnon(c.env).from("invitations").select("*").eq("slug", slug).single();
  if (error || !data) return c.json({ error: "not found" }, 404);
  if (data.status !== "published") return c.json({ error: "not published" }, 403);
  const admin = sbAdmin(c.env);
  const [{ data: wishes }, { data: gallery }] = await Promise.all([
    admin.from("wishes").select("*").eq("invitation_id", data.id).order("created_at", { ascending: false }).limit(50),
    admin.from("gallery_items").select("*").eq("invitation_id", data.id).order("sort_order"),
  ]);
  admin.from("analytics").insert({ invitation_id: data.id, guest_slug: to });
  admin.from("invitations").update({ view_count: (data.view_count ?? 0) + 1 }).eq("id", data.id);
  return c.json({ invitation: data, wishes: wishes ?? [], gallery: gallery ?? [] });
});

app.get("/api/invitations", async (c) => {
  const u = await getUser(c as never);
  if (!u) return c.json({ error: "auth required" }, 401);
  const { data, error } = await sbAdmin(c.env).from("invitations").select("*").eq("user_id", u.id).order("created_at", { ascending: false });
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

app.get("/api/invitations/:id", async (c) => {
  const u = await getUser(c as never);
  if (!u) return c.json({ error: "auth required" }, 401);
  const id = c.req.param("id");
  const admin = sbAdmin(c.env);
  const { data, error } = await admin.from("invitations").select("*").eq("id", id).single();
  if (error || !data) return c.json({ error: "not found" }, 404);
  if (data.user_id !== u.id) return c.json({ error: "forbidden" }, 403);
  const [{ data: guests }, { data: gallery }] = await Promise.all([
    admin.from("guests").select("*").eq("invitation_id", id).order("created_at", { ascending: false }).limit(100),
    admin.from("gallery_items").select("*").eq("invitation_id", id).order("sort_order"),
  ]);
  return c.json({ invitation: data, guests: guests ?? [], gallery: gallery ?? [] });
});

app.post("/api/invitations", async (c) => {
  const u = await getUser(c as never);
  if (!u) return c.json({ error: "auth required" }, 401);
  const body = await c.req.json().catch(() => ({})) as Record<string, string>;
  const { title, slug, tier = "bronze", track = "self", templateSlug, brief } = body as { title?: string; slug?: string; tier?: string; track?: string; templateSlug?: string; brief?: string };
  const slugVal = slugify(slug || title || "undangan-kami");
  let templateId: string | null = null;
  if (templateSlug) {
    const { data } = await sbAdmin(c.env).from("templates").select("id").eq("slug", templateSlug).maybeSingle();
    templateId = data?.id ?? null;
  }
  const expiredAt = tier === "platinum" ? null : new Date(Date.now() + tierDays(tier) * 864e5).toISOString();
  const admin = sbAdmin(c.env);
  const { data: inv, error: invErr } = await admin.from("invitations").insert({
    user_id: u.id, template_id: templateId, slug: slugVal, title: title || slugVal, track, tier, expired_at: expiredAt, data: {}, status: "draft",
  }).select("id,slug").single();
  if (invErr) return c.json({ error: invErr.message }, 400);
  if (track === "assisted") {
    const { data: order, error: oErr } = await admin.from("orders").insert({ user_id: u.id, invitation_id: inv.id, tier, amount: tierAmount(tier), track: "assisted", payment_status: "pending" }).select("id").single();
    if (oErr) return c.json({ error: oErr.message }, 400);
    const { error: aErr } = await admin.from("assistance_requests").insert({ user_id: u.id, order_id: order.id, invitation_id: inv.id, template_id: templateId, brief: brief ?? null });
    if (aErr) return c.json({ error: aErr.message }, 400);
  }
  return c.json(inv);
});

app.patch("/api/invitations/:id", async (c) => {
  const u = await getUser(c as never);
  if (!u) return c.json({ error: "auth required" }, 401);
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({})) as Record<string, unknown>;
  const admin = sbAdmin(c.env);
  const { data: cur } = await admin.from("invitations").select("user_id").eq("id", id).single();
  if (!cur || cur.user_id !== u.id) return c.json({ error: "forbidden" }, 403);
  const patch: Record<string, unknown> = {};
  if (body.title !== undefined) patch.title = body.title;
  if (body.slug !== undefined) patch.slug = slugify(String(body.slug));
  if (body.data !== undefined) patch.data = body.data;
  if (body.status !== undefined) patch.status = body.status;
  const { data, error } = await admin.from("invitations").update(patch).eq("id", id).select("*").single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/api/invitations/:id/guests", async (c) => {
  const u = await getUser(c as never);
  if (!u) return c.json({ error: "auth required" }, 401);
  const id = c.req.param("id");
  const { name } = await c.req.json().catch(() => ({})) as { name?: string };
  if (!name?.trim()) return c.json({ error: "name required" }, 400);
  const admin = sbAdmin(c.env);
  const { data: inv } = await admin.from("invitations").select("user_id").eq("id", id).single();
  if (!inv || inv.user_id !== u.id) return c.json({ error: "forbidden" }, 403);
  const gs = slugify(name);
  const { data, error } = await admin.from("guests").insert({ invitation_id: id, name: name.trim(), slug: gs }).select("*").single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/api/invitations/:id/gallery", async (c) => {
  const u = await getUser(c as never);
  if (!u) return c.json({ error: "auth required" }, 401);
  const id = c.req.param("id");
  const admin = sbAdmin(c.env);
  const { data: inv } = await admin.from("invitations").select("user_id,slug").eq("id", id).single();
  if (!inv || inv.user_id !== u.id) return c.json({ error: "forbidden" }, 403);
  const ct = c.req.header("content-type") ?? "";
  if (ct.includes("application/json")) {
    const { url } = await c.req.json().catch(() => ({})) as { url?: string };
    if (!url) return c.json({ error: "url required" }, 400);
    const { data, error } = await admin.from("gallery_items").insert({ invitation_id: id, type: "photo", url }).select("*").single();
    if (error) return c.json({ error: error.message }, 400);
    return c.json(data);
  }
  const form = await c.req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  if (!file) return c.json({ error: "file or url required" }, 400);
  const buf = Buffer.from(await file.arrayBuffer());
  let url = `memory:${file.name}`;
  let driveId: string | null = null;
  if (c.env.GOOGLE_CLIENT_ID) {
    const { data: tok } = await admin.from("gdrive_tokens").select("id").eq("user_id", u.id).maybeSingle();
    if (tok) {
      const drive = await driveFor(c.env, u.id);
      const root = await ensureFolder(drive, "Invora");
      const folder = await ensureFolder(drive, inv.slug, root);
      const up = await uploadBuffer(drive, { buffer: buf, filename: file.name, mimeType: file.type || "image/jpeg" }, folder);
      driveId = up.id ?? null; url = driveId ? `https://drive.google.com/uc?export=view&id=${driveId}` : url;
    }
  }
  const type = file.type?.startsWith("video") ? "video" : "photo";
  const { data, error } = await admin.from("gallery_items").insert({ invitation_id: id, type, url, drive_file_id: driveId }).select("*").single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

app.post("/api/invitations/:id/wishes", async (c) => {
  const id = c.req.param("id");
  const { guest_name, message, rsvp_status } = await c.req.json().catch(() => ({})) as { guest_name?: string; message?: string; rsvp_status?: string };
  if (!guest_name?.trim() || !message?.trim()) return c.json({ error: "guest_name & message required" }, 400);
  const { data, error } = await sbAnon(c.env).from("wishes").insert({ invitation_id: id, guest_name: guest_name.trim(), message: message.trim(), rsvp_status: rsvp_status ?? null }).select("*").single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(data);
});

function gdriveOAuth(env: Env) {
  return new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_REDIRECT_URI);
}
app.get("/api/auth/gdrive/url", async (c) => {
  const u = await getUser(c as never);
  if (!u) return c.json({ error: "auth required" }, 401);
  if (!c.env.GOOGLE_CLIENT_ID) return c.json({ error: "GOOGLE_CLIENT_ID missing" }, 400);
  const url = gdriveOAuth(c.env).generateAuthUrl({ access_type: "offline", prompt: "consent", scope: ["https://www.googleapis.com/auth/drive.file"], state: u.id });
  return c.json({ url });
});
app.get("/api/auth/gdrive/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const frontend = c.env.FRONTEND_URL ?? "https://invora-frontend.pages.dev";
  if (!code) return c.redirect(`${frontend}/dashboard/settings?error=gdrive`);
  if (!state) return c.redirect(`${frontend}/dashboard/settings?error=gdrive_state`);
  try {
    const { tokens } = await gdriveOAuth(c.env).getToken(code);
    if (!tokens.access_token || !tokens.refresh_token) throw new Error("token incomplete");
    const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : new Date(Date.now() + 3600 * 1000).toISOString();
    const { error } = await sbAdmin(c.env).from("gdrive_tokens").upsert({ user_id: state, access_token: tokens.access_token, refresh_token: tokens.refresh_token, expires_at: expiresAt }, { onConflict: "user_id" });
    if (error) throw error;
    return c.redirect(`${frontend}/dashboard/settings?gdrive=connected`);
  } catch { return c.redirect(`${frontend}/dashboard/settings?error=gdrive_exchange`); }
});
app.delete("/api/auth/gdrive", async (c) => {
  const u = await getUser(c as never);
  if (!u) return c.json({ error: "auth" }, 401);
  await sbAdmin(c.env).from("gdrive_tokens").delete().eq("user_id", u.id);
  return c.json({ ok: true });
});
app.get("/api/auth/gdrive/status", async (c) => {
  const u = await getUser(c as never);
  if (!u) return c.json({ connected: false });
  const { data } = await sbAdmin(c.env).from("gdrive_tokens").select("id").eq("user_id", u.id).maybeSingle();
  return c.json({ connected: !!data });
});

async function driveFor(env: Env, userId: string) {
  const admin = sbAdmin(env);
  const { data: tok } = await admin.from("gdrive_tokens").select("*").eq("user_id", userId).single();
  if (!tok) throw new Error("gdrive not connected");
  const o = gdriveOAuth(env);
  o.setCredentials({ access_token: tok.access_token, refresh_token: tok.refresh_token, expiry_date: new Date(tok.expires_at).getTime() });
  o.on("tokens", async (fresh) => {
    await admin.from("gdrive_tokens").update({ access_token: fresh.access_token ?? tok.access_token, refresh_token: fresh.refresh_token ?? tok.refresh_token, expires_at: fresh.expiry_date ? new Date(fresh.expiry_date).toISOString() : tok.expires_at }).eq("user_id", userId);
  });
  return google.drive({ version: "v3", auth: o });
}
async function ensureFolder(drive: ReturnType<typeof google.drive>, name: string, parentId?: string) {
  const q = [`name = '${name.replace(/'/g, "\\'")}'`, "mimeType = 'application/vnd.google-apps.folder'", "trashed = false", parentId ? `'${parentId}' in parents` : undefined].filter(Boolean).join(" and ");
  const found = await drive.files.list({ q, fields: "files(id,name)", pageSize: 1 });
  if (found.data.files?.[0]?.id) return found.data.files[0].id!;
  const created = await drive.files.create({ requestBody: { name, mimeType: "application/vnd.google-apps.folder", parents: parentId ? [parentId] : undefined }, fields: "id" });
  return created.data.id!;
}
async function uploadBuffer(drive: ReturnType<typeof google.drive>, file: { buffer: Buffer; filename: string; mimeType: string }, folderId: string) {
  const { Readable } = await import("stream");
  const res = await drive.files.create({ requestBody: { name: file.filename, parents: [folderId] }, media: { mimeType: file.mimeType, body: Readable.from(file.buffer) }, fields: "id,name,webViewLink" });
  if (res.data.id) await drive.permissions.create({ fileId: res.data.id, requestBody: { role: "reader", type: "anyone" } });
  return res.data;
}

export default app;
