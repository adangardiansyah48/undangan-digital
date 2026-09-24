import { authHeader } from "./supabase";
export const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";
export async function api(path: string, init: RequestInit = {}) {
  const h = await authHeader();
  const res = await fetch(`${API}${path}`, { ...init, headers: { "Content-Type": "application/json", ...h, ...(init.headers as Record<string,string> | undefined) } });
  if (!res.ok) { const body = await res.json().catch(()=>({error:res.statusText})); throw new Error(body.error ?? res.statusText); }
  return res.json();
}
