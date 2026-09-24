import { createClient } from "@supabase/supabase-js";

export function supabaseAnon() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
}

export function supabaseAdmin() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getUserFromAuth(req: { headers: Record<string, string | string[] | undefined> }) {
  const hdr = req.headers.authorization ?? req.headers.Authorization;
  const token = Array.isArray(hdr) ? hdr[0] : (hdr as string | undefined);
  if (!token?.startsWith("Bearer ")) return null;
  const jwt = token.slice(7);
  const admin = supabaseAdmin();
  const { data } = await admin.auth.getUser(jwt);
  return data.user ?? null;
}
