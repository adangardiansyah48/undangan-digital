import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, authHeader } from "../lib/supabase";
import { API } from "../lib/api";
export default function Settings() {
  const nav = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    (async () => { const h = await authHeader(); try { const r = await fetch(`${API}/api/auth/gdrive/status`, { headers: h }); const d = await r.json(); setConnected(!!d.connected); } catch { setConnected(false); } })();
  }, []);
  async function connect() { const h = await authHeader(); const r = await fetch(`${API}/api/auth/gdrive/url`, { headers: h }); const d = await r.json(); if (d.url) location.href = d.url; else setMsg(d.error); }
  async function disconnect() { const h = await authHeader(); await fetch(`${API}/api/auth/gdrive`, { method: "DELETE", headers: h }); setConnected(false); }
  async function logout() { await supabase.auth.signOut(); nav("/login"); }
  return (
    <div style={{ minHeight: "100svh", background: "#f8f7f4", fontFamily: "Outfit,system-ui,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@400;500;600&display=swap');`}</style>
      <header style={{ position: "sticky", top: 0, background: "rgba(255,255,255,.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid #ebe8e3" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}><img src="/logo.svg" alt="mstory.id" style={{ height: 34, width: "auto" }} /><span style={{ fontSize: 10, background: "#1c3147", color: "#fff", borderRadius: 999, padding: "4px 8px", letterSpacing: ".12em", fontWeight: 600 }}>ADMIN</span></Link>
          <nav style={{ display: "flex", gap: 8, alignItems: "center" }}><Link to="/admin" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>Pesanan</Link><Link to="/dashboard" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>Dashboard</Link><button onClick={logout} style={{ fontSize: 12, padding: "7px 10px", borderRadius: 999, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>Keluar</button></nav>
        </div>
      </header>
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "20px 16px 40px" }}>
        <div style={{ background: "#fff", border: "1px solid #ebe8e3", borderRadius: 16, padding: 18 }}>
          <p style={{ fontSize: 11, letterSpacing: ".18em", color: "#c4a574", margin: 0, fontWeight: 700 }}>SETTINGS</p>
          <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, margin: "6px 0 4px", color: "#1c3147" }}>Akun & GDrive</h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>{email ?? ""}</p>
          <div style={{ marginTop: 16, background: "#f8f7f4", border: "1px solid #ebe8e3", borderRadius: 12, padding: 14 }}>
            <p style={{ margin: 0, fontWeight: 600, color: "#1c3147" }}>Google Drive</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>Guest upload pakai GDrive global (service refresh_token). Hubungkan opsional untuk Editor admin.</p>
            <p style={{ margin: "8px 0 0", fontSize: 13 }}>{connected === null ? "…" : connected ? "Terhubung ✓" : "Belum terhubung"}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={connect} style={{ padding: "9px 14px", borderRadius: 999, border: 0, background: "#1c3147", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Hubungkan GDrive</button>
              <button onClick={disconnect} style={{ padding: "9px 14px", borderRadius: 999, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>Putuskan</button>
            </div>
            {msg && <p style={{ color: "crimson", fontSize: 13 }}>{msg}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
