import { Router } from "express";
import { gdriveAuthUrl, exchangeCode, saveTokens } from "../lib/gdrive.js";
import { getUserFromAuth, supabaseAdmin } from "../lib/supabase.js";

const r = Router();

r.get("/gdrive/url", async (req, res, next) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) return res.status(400).json({ error: "GOOGLE_CLIENT_ID missing" });
    const user = await getUserFromAuth(req as unknown as { headers: Record<string,string> });
    if (!user) return res.status(401).json({ error: "auth required" });
    res.json({ url: gdriveAuthUrl(user.id) });
  } catch (e) { next(e); }
});

r.get("/gdrive/callback", async (req, res) => {
  const code = req.query.code as string | undefined;
  const state = req.query.state as string | undefined;
  const frontend = process.env.FRONTEND_URL ?? "http://localhost:5173";
  if (!code) return res.redirect(`${frontend}/dashboard/settings?error=gdrive`);
  if (!state) return res.redirect(`${frontend}/dashboard/settings?error=gdrive_state`);
  try {
    const tokens = await exchangeCode(code);
    await saveTokens(state, tokens as never);
    res.redirect(`${frontend}/dashboard/settings?gdrive=connected`);
  } catch {
    res.redirect(`${frontend}/dashboard/settings?error=gdrive_exchange`);
  }
});

r.delete("/gdrive", async (req, res, next) => {
  try {
    const user = await getUserFromAuth(req as unknown as { headers: Record<string,string> });
    if (!user) return res.status(401).json({ error: "auth" });
    await supabaseAdmin().from("gdrive_tokens").delete().eq("user_id", user.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

r.get("/gdrive/status", async (req, res, next) => {
  try {
    const user = await getUserFromAuth(req as unknown as { headers: Record<string,string> });
    if (!user) return res.json({ connected: false });
    const { data } = await supabaseAdmin().from("gdrive_tokens").select("id").eq("user_id", user.id).maybeSingle();
    res.json({ connected: !!data });
  } catch (e) { next(e); }
});

export default r;
