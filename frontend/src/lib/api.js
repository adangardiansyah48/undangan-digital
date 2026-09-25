import { authHeader } from "./supabase";
export const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
export async function api(path, init = {}) {
    const h = await authHeader();
    const res = await fetch(`${API}${path}`, { ...init, headers: { "Content-Type": "application/json", ...h, ...init.headers } });
    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(body.error ?? res.statusText);
    }
    return res.json();
}
