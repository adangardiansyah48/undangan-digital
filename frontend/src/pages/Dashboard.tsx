import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";
export default function Dashboard() {
  const nav = useNavigate();
  const [items, setItems] = useState<{ id: string; slug: string; title: string; tier: string; status: string }[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    api("/api/invitations").then(setItems).catch((e) => setErr((e as Error).message));
  }, []);
  async function logout() { await supabase.auth.signOut(); nav("/login"); }
  return (
    <div style={{ minHeight: "100svh", background: "#f8f7f4", fontFamily: "Outfit,system-ui,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@400;500;600&display=swap');`}</style>
      <header style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(255,255,255,.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid #ebe8e3" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/logo.svg" alt="mstory.id" style={{ height: 34, width: "auto" }} />
            <span style={{ fontSize: 10, background: "#1c3147", color: "#fff", borderRadius: 999, padding: "4px 8px", letterSpacing: ".12em", fontWeight: 600 }}>ADMIN</span>
          </Link>
          <nav style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Link to="/" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>Katalog</Link>
            <Link to="/admin" style={{ fontSize: 13, color: "#1c3147", textDecoration: "none", border: "1px solid #c4a574", padding: "7px 12px", borderRadius: 999, fontWeight: 600 }}>Pesanan Guest</Link>
            <Link to="/dashboard/settings" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>Settings</Link>
            <span style={{ fontSize: 12, color: "#9aa" }}>{email ?? ""}</span>
            <button onClick={logout} style={{ fontSize: 12, padding: "7px 10px", borderRadius: 999, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>Keluar</button>
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "18px 16px 40px" }}>
        <div style={{ background: "#fff", border: "1px solid #ebe8e3", borderRadius: 16, padding: 16 }}>
          <p style={{ fontSize: 11, letterSpacing: ".18em", color: "#c4a574", margin: 0, fontWeight: 700 }}>DASHBOARD — INVITATIONS (LEGACY)</p>
          <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, margin: "6px 0 4px", color: "#1c3147" }}>Undangan Terbuat</h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>Kelola invitations yang sudah dibuat via editor. Untuk pesanan toko (guest) buka <Link to="/admin" style={{ color: "#1c3147", fontWeight: 600 }}>Admin — Pesanan</Link>. {err && <span style={{ color: "crimson" }}>· {err}</span>}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Link to="/dashboard/new" style={{ background: "#1c3147", color: "#fff", padding: "9px 14px", borderRadius: 999, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>+ Buatkan Undangan (Admin Builder)</Link>
            <Link to="/admin" style={{ background: "#fff", color: "#1c3147", border: "1px solid #c4a574", padding: "9px 14px", borderRadius: 999, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>Lihat Pesanan Guest →</Link>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12, marginTop: 16 }}>
          {!items.length ? (
            <div style={{ gridColumn: "1/-1", background: "#fff", border: "1px dashed #c4a57488", borderRadius: 14, padding: 18, textAlign: "center" }}>
              <p style={{ margin: 0, color: "#1c3147", fontWeight: 600 }}>Belum ada undangan invitations</p>
              <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13 }}>Buat dari pesanan guest atau manual.</p>
            </div>
          ) : items.map((i) => (
            <article key={i.id} style={{ background: "#fff", border: "1px solid #ebe8e3", borderRadius: 14, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <b style={{ color: "#1c3147", fontSize: 14 }}>{i.title ?? i.slug}</b>
                <span style={{ fontSize: 11, background: i.status === "published" ? "#10b981" : "#f59e0b", color: "#fff", padding: "3px 8px", borderRadius: 999, height: "fit-content" }}>{i.status}</span>
              </div>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "#6b7280" }}>/{i.slug} · {i.tier}</p>
              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                <Link to={`/dashboard/invitations/${i.id}`} style={{ background: "#1c3147", color: "#fff", padding: "7px 10px", borderRadius: 999, textDecoration: "none", fontSize: 12, fontWeight: 600 }}>Editor</Link>
                <Link to={`/${i.slug}?to=Tamu`} style={{ background: "#fff", color: "#1c3147", border: "1px solid #ddd", padding: "7px 10px", borderRadius: 999, textDecoration: "none", fontSize: 12 }}>Public</Link>
                <Link to={`/preview/${i.slug}`} style={{ color: "#6b7280", fontSize: 12, alignSelf: "center" }}>Preview</Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
