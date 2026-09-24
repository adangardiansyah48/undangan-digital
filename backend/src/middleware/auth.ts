import type { RequestHandler } from "express";
import { getUserFromAuth } from "../lib/supabase.js";

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const user = await getUserFromAuth(req as unknown as { headers: Record<string, string> });
  if (!user) {
    const e = new Error("auth required") as Error & { status?: number };
    e.status = 401;
    return next(e);
  }
  (req as unknown as Record<string, unknown>).user = user;
  next();
};
