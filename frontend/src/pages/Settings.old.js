import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { supabase, authHeader } from "../lib/supabase";
import { API } from "../lib/api";
export default function Settings() {
    const [email, setEmail] = useState(null);
    const [connected, setConnected] = useState(null);
    const [msg, setMsg] = useState(null);
    useEffect(() => { supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null)); (async () => { const h = await authHeader(); try {
        const r = await fetch(`${API}/api/auth/gdrive/status`, { headers: h });
        const d = await r.json();
        setConnected(!!d.connected);
    }
    catch {
        setConnected(false);
    } })(); }, []);
    async function connect() { const h = await authHeader(); const r = await fetch(`${API}/api/auth/gdrive/url`, { headers: h }); const d = await r.json(); if (d.url)
        location.href = d.url;
    else
        setMsg(d.error); }
    async function disconnect() { const h = await authHeader(); await fetch(`${API}/api/auth/gdrive`, { method: "DELETE", headers: h }); setConnected(false); }
    return (_jsxs("main", { style: { maxWidth: 560, margin: "0 auto", padding: 24 }, children: [_jsx("h1", { children: "Settings" }), _jsx("p", { children: email ?? "" }), _jsxs("p", { children: ["GDrive: ", connected === null ? "…" : connected ? "Terhubung ✓" : "Belum"] }), _jsx("button", { onClick: connect, children: "Hubungkan GDrive" }), " ", _jsx("button", { onClick: disconnect, children: "Putuskan" }), msg && _jsx("p", { style: { color: "crimson" }, children: msg })] }));
}
