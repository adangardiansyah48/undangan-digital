import { Router } from "express";
import { supabaseAnon } from "../lib/supabase.js";

const r = Router();

r.get("/", async (req, res, next) => {
  try {
    const cat = (req.query.cat as string | undefined) ?? "all";
    const sb = supabaseAnon();
    let q = sb.from("templates").select("*").eq("is_active", true).order("sort_order");
    if (cat !== "all") q = q.eq("category", cat);
    const { data, error } = await q;
    if (error) throw error;
    res.json(data);
  } catch (e) { next(e); }
});

r.get("/:slug", async (req, res, next) => {
  try {
    const { data, error } = await supabaseAnon().from("templates").select("*").eq("slug", req.params.slug).single();
    if (error) throw error;
    res.json(data);
  } catch (e) { next(e); }
});

export default r;
