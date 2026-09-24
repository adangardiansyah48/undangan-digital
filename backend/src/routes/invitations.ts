import { Router } from "express";
import multer from "multer";
import { supabaseAdmin, supabaseAnon, getUserFromAuth } from "../lib/supabase.js";
import { requireAuth } from "../middleware/auth.js";
import { slugify } from "../lib/slug.js";

const r = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

r.get("/by-slug/:slug", async (req, res, next) => {
  try {
    const { data, error } = await supabaseAnon().from("invitations").select("*").eq("slug", req.params.slug).single();
    if (error) return res.status(404).json({ error: "not found" });
    if (data.status !== "published") return res.status(403).json({ error: "not published" });
    const sb = supabaseAdmin();
    const [{ data: wishes }, { data: gallery }] = await Promise.all([
      sb.from("wishes").select("*").eq("invitation_id", data.id).order("created_at", { ascending: false }).limit(50),
      sb.from("gallery_items").select("*").eq("invitation_id", data.id).order("sort_order"),
    ]);
    void sb.from("analytics").insert({ invitation_id: data.id, guest_slug: (req.query.to as string) ?? null });
    void sb.from("invitations").update({ view_count: (data.view_count ?? 0) + 1 }).eq("id", data.id);
    res.json({ invitation: data, wishes: wishes ?? [], gallery: gallery ?? [] });
  } catch (e) { next(e); }
});

r.use(requireAuth);

r.get("/", async (req, res, next) => {
  try {
    const user = await getUserFromAuth(req as unknown as { headers: Record<string,string> });
    const { data, error } = await supabaseAdmin().from("invitations").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    if (error) throw error; res.json(data);
  } catch (e) { next(e); }
});

r.get("/:id", async (req, res, next) => {
  try {
    const user = await getUserFromAuth(req as unknown as { headers: Record<string,string> });
    const { data, error } = await supabaseAdmin().from("invitations").select("*").eq("id", req.params.id).single();
    if (error || !data) return res.status(404).json({ error: "not found" });
    if (data.user_id !== user!.id) return res.status(403).json({ error: "forbidden" });
    const [{ data: guests }, { data: gallery }] = await Promise.all([
      supabaseAdmin().from("guests").select("*").eq("invitation_id", data.id).order("created_at", { ascending: false }).limit(100),
      supabaseAdmin().from("gallery_items").select("*").eq("invitation_id", data.id).order("sort_order"),
    ]);
    res.json({ invitation: data, guests: guests ?? [], gallery: gallery ?? [] });
  } catch (e) { next(e); }
});

r.post("/", async (req, res, next) => {
  try {
    const user = await getUserFromAuth(req as unknown as { headers: Record<string,string> });
    const { title, slug, tier = "bronze", track = "self", templateSlug, brief } = req.body;
    const slugVal = slugify(slug || title || "undangan-kami");
    let templateId: string | null = null;
    if (templateSlug) {
      const { data } = await supabaseAdmin().from("templates").select("id").eq("slug", templateSlug).maybeSingle();
      templateId = data?.id ?? null;
    }
    const expiredAt = tier === "platinum" ? null : new Date(Date.now() + tierDays(tier) * 864e5).toISOString();
    const { data: inv, error: invErr } = await supabaseAdmin().from("invitations").insert({
      user_id: user!.id, template_id: templateId, slug: slugVal, title: title || slugVal, track, tier, expired_at: expiredAt, data: {}, status: "draft",
    }).select("id,slug").single();
    if (invErr) throw invErr;
    if (track === "assisted") {
      const { data: order, error: oErr } = await supabaseAdmin().from("orders").insert({ user_id: user!.id, invitation_id: inv.id, tier, amount: tierAmount(tier), track: "assisted", payment_status: "pending" }).select("id").single();
      if (oErr) throw oErr;
      const { error: aErr } = await supabaseAdmin().from("assistance_requests").insert({ user_id: user!.id, order_id: order.id, invitation_id: inv.id, template_id: templateId, brief: brief ?? null });
      if (aErr) throw aErr;
    }
    res.json(inv);
  } catch (e) { next(e); }
});

r.patch("/:id", async (req, res, next) => {
  try {
    const user = await getUserFromAuth(req as unknown as { headers: Record<string,string> });
    const { title, slug, data, status } = req.body;
    const { data: cur } = await supabaseAdmin().from("invitations").select("user_id").eq("id", req.params.id).single();
    if (!cur || cur.user_id !== user!.id) return res.status(403).json({ error: "forbidden" });
    const patch: Record<string, unknown> = {};
    if (title !== undefined) patch.title = title;
    if (slug !== undefined) patch.slug = slugify(slug);
    if (data !== undefined) patch.data = data;
    if (status !== undefined) patch.status = status;
    const { data: upd, error } = await supabaseAdmin().from("invitations").update(patch).eq("id", req.params.id).select("*").single();
    if (error) throw error; res.json(upd);
  } catch (e) { next(e); }
});

r.post("/:id/guests", async (req, res, next) => {
  try {
    const user = await getUserFromAuth(req as unknown as { headers: Record<string,string> });
    const { name } = req.body; if (!name?.trim()) return res.status(400).json({ error: "name required" });
    const { data: inv } = await supabaseAdmin().from("invitations").select("user_id").eq("id", req.params.id).single();
    if (!inv || inv.user_id !== user!.id) return res.status(403).json({ error: "forbidden" });
    const gs = slugify(name);
    const { data: g, error } = await supabaseAdmin().from("guests").insert({ invitation_id: req.params.id, name: name.trim(), slug: gs }).select("*").single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(g);
  } catch (e) { next(e); }
});

r.post("/:id/gallery", upload.single("file"), async (req, res, next) => {
  try {
    const user = await getUserFromAuth(req as unknown as { headers: Record<string,string> });
    const { data: inv } = await supabaseAdmin().from("invitations").select("user_id,slug").eq("id", req.params.id).single();
    if (!inv || inv.user_id !== user!.id) return res.status(403).json({ error: "forbidden" });
    const file = req.file as Express.Multer.File | undefined;
    const urlBody = (req.body as { url?: string })?.url;
    if (urlBody) {
      const { data: row, error } = await supabaseAdmin().from("gallery_items").insert({ invitation_id: req.params.id, type: "photo", url: urlBody }).select("*").single();
      if (error) throw error; return res.json(row);
    }
    if (!file) return res.status(400).json({ error: "file or url required" });
    let url = `memory:${file.originalname}`;
    let driveId: string | null = null;
    if (process.env.GOOGLE_CLIENT_ID) {
      const { data: tok } = await supabaseAdmin().from("gdrive_tokens").select("id").eq("user_id", user!.id).maybeSingle();
      if (tok) {
        const { ensureFolder, uploadBuffer, driveUrl } = await import("../lib/gdrive.js");
        const root = await ensureFolder(user!.id, "Invora");
        const folder = await ensureFolder(user!.id, inv.slug, root);
        const up = await uploadBuffer(user!.id, { buffer: file.buffer, filename: file.originalname, mimeType: file.mimetype || "image/jpeg" }, folder);
        driveId = up.id ?? null; url = driveId ? driveUrl(driveId) : url;
      }
    }
    const type = file.mimetype?.startsWith("video") ? "video" : "photo";
    const { data: row, error } = await supabaseAdmin().from("gallery_items").insert({ invitation_id: req.params.id, type, url, drive_file_id: driveId }).select("*").single();
    if (error) throw error; res.json(row);
  } catch (e) { next(e); }
});

r.post("/:id/wishes", async (req, res, next) => {
  try {
    const { guest_name, message, rsvp_status } = req.body;
    if (!guest_name?.trim() || !message?.trim()) return res.status(400).json({ error: "guest_name & message required" });
    const { data: row, error } = await supabaseAnon().from("wishes").insert({ invitation_id: req.params.id, guest_name: guest_name.trim(), message: message.trim(), rsvp_status: rsvp_status ?? null }).select("*").single();
    if (error) throw error; res.json(row);
  } catch (e) { next(e); }
});

function tierAmount(t: string){ const m:Record<string,number>={bronze:0,silver:35000,gold:65000,platinum:97000}; return m[t]??0; }
function tierDays(t: string){ const m:Record<string,number>={bronze:2,silver:10,gold:30,platinum:0}; return m[t]??2; }

export default r;
