import { useEffect, useState } from "react";
import { supabase, authHeader } from "../lib/supabase";
import { API } from "../lib/api";
import { AdminLayout } from "../components/AdminLayout";
export default function Settings() {
  const [email, setEmail] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>("/logo.svg");
  const [logoMsg, setLogoMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    supabase.from("site_settings").select("value").eq("id", "logo_url").maybeSingle().then(({ data }) => { if (data?.value) setLogoUrl(data.value); });
    (async () => { const h = await authHeader(); try { const r = await fetch(`${API}/api/auth/gdrive/status`, { headers: h }); const d = await r.json(); setConnected(!!d.connected); } catch { setConnected(false); } })();
  }, []);
  async function connect() { const h = await authHeader(); const r = await fetch(`${API}/api/auth/gdrive/url`, { headers: h }); const d = await r.json(); if (d.url) location.href = d.url; else setMsg(d.error); }
  async function disconnect() { const h = await authHeader(); await fetch(`${API}/api/auth/gdrive`, { method: "DELETE", headers: h }); setConnected(false); }
  async function uploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true); setLogoMsg(null);
    try {
      const h = await authHeader();
      const fd = new FormData(); fd.set("file", f);
      const r = await fetch(`${API}/api/site-settings/logo`, { method: "POST", headers: h as never, body: fd });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error ?? "upload fail");
      setLogoUrl(j.url); setLogoMsg("Logo terupdate — akan dipakai di login, katalog, judul halaman.");
    } catch (e2) { setLogoMsg((e2 as Error).message); } finally { setUploading(false); }
  }
  return (
    <AdminLayout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@400;500;600&display=swap');`}</style>
      <div style={{ maxWidth: 640 }}>
        <p style={{ fontSize: 11, letterSpacing: ".18em", color: "#c4a574", margin: 0, fontWeight: 700 }}>PENGATURAN</p>
        <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, margin: "6px 0 4px", color: "#1c3147" }}>Pengaturan Situs</h1>
        <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>{email ?? ""} · Kelola logo & GDrive</p>

        <div style={{ marginTop: 16, background: "#fff", border: "1px solid #ebe8e3", borderRadius: 16, padding: 16 }}>
          <p style={{ margin: 0, fontWeight: 700, color: "#1c3147" }}>Logo Situs</p>
          <p style={{ margin: "4px 0 12px", fontSize: 12, color: "#6b7280" }}>Upload logo baru — dipakai dinamis di halaman login, katalog pelanggan, judul tab, dan header. Format PNG/SVG, max 5MB.</p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <img src={logoUrl} alt="logo" style={{ height: 40, width: "auto", border: "1px solid #ebe8e3", borderRadius: 10, padding: 6, background: "#f8f7f4" }} />
            <label style={{ padding: "9px 14px", borderRadius: 999, background: "#1c3147", color: "#fff", fontWeight: 600, cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.6 : 1 }}>
              {uploading ? "Mengupload…" : "Upload Logo Baru"}
              <input type="file" accept="image/*,.svg" onChange={uploadLogo} disabled={uploading} style={{ display: "none" }} />
            </label>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "#9aa", wordBreak: "break-all" }}>{logoUrl}</p>
          {logoMsg && <p style={{ fontSize: 13, color: logoMsg.includes("terupdate") ? "#0a7" : "crimson" }}>{logoMsg}</p>}
        </div>

        <div style={{ marginTop: 14, background: "#fff", border: "1px solid #ebe8e3", borderRadius: 16, padding: 16 }}>
          <p style={{ margin: 0, fontWeight: 700, color: "#1c3147" }}>Google Drive</p>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>Guest upload pakai GDrive global (service refresh_token). Hubungkan opsional untuk Editor admin personal.</p>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: connected ? "#0a7" : "#6b7280" }}>{connected === null ? "…" : connected ? "Terhubung ✓" : "Belum terhubung"}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={connect} style={{ padding: "9px 14px", borderRadius: 999, border: 0, background: "#1c3147", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Hubungkan GDrive</button>
            <button onClick={disconnect} style={{ padding: "9px 14px", borderRadius: 999, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>Putuskan</button>
          </div>
          {msg && <p style={{ color: "crimson", fontSize: 13, marginTop: 8 }}>{msg}</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
