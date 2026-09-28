import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";
import { AdminLayout } from "../components/AdminLayout";
export default function Dashboard() {
  const [items, setItems] = useState<{ id: string; slug: string; title: string; tier: string; status: string }[]>([]);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    api("/api/invitations").then(setItems).catch((e) => setErr((e as Error).message));
  }, []);
  return (
    <AdminLayout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@400;500;600&display=swap');`}</style>
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
    </AdminLayout>
  );
}
