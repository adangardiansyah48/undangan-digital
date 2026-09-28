import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, authHeader } from "../lib/supabase";
import { API } from "../lib/api";
import { AdminLayout } from "../components/AdminLayout";
type OrderRow = { id: string; template_slug: string; status: string; payment_status: string; contact_name: string; contact_wa: string; contact_email?: string | null; data: Record<string, unknown>; created_at: string };
export default function Admin() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    supabase.from("profiles").select("role").maybeSingle().then(({ data }) => setRole((data as { role?: string } | null)?.role ?? null));
    load();
  }, []);
  async function load() {
    const h = await authHeader();
    const r = await fetch(`${API}/api/guest-orders`, { headers: h });
    const j = await r.json().catch(() => []);
    if (Array.isArray(j)) { setOrders(j); setMsg(null); } else setMsg(j.error ?? "load fail");
  }
  async function patch(id: string, patch: Record<string, string>) {
    const h = await authHeader();
    const r = await fetch(`${API}/api/guest-orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...h }, body: JSON.stringify(patch) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) setMsg(j.error ?? "update fail"); else load();
  }
  const list = orders.filter((o) => (filter === "all" || o.status === filter) && (!q || o.template_slug.toLowerCase().includes(q.toLowerCase()) || o.contact_name.toLowerCase().includes(q.toLowerCase()) || o.contact_wa.includes(q)));
  const stats = { total: orders.length, pending: orders.filter((x) => x.status === "pending").length, in_progress: orders.filter((x) => x.status === "in_progress").length, review: orders.filter((x) => x.status === "review").length, done: orders.filter((x) => x.status === "done").length };
  const pill: React.CSSProperties = { padding: "7px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid #ebe8e3" };
  const input: React.CSSProperties = { padding: "9px 12px", borderRadius: 999, border: "1px solid #ddd", fontSize: 13, background: "#fff" };
  if (role && !["admin", "superadmin"].includes(role)) {
    return (
      <div style={{ minHeight: "100svh", background: "#f8f7f4", display: "grid", placeItems: "center", padding: 16, fontFamily: "Outfit,system-ui,sans-serif" }}>
        <div style={{ background: "#fff", border: "1px solid #ebe8e3", borderRadius: 16, padding: 20, maxWidth: 420, textAlign: "center" }}>
          <p style={{ color: "#dc2626", fontWeight: 700 }}>Akses admin saja</p>
          <p style={{ fontSize: 13, color: "#6b7280" }}>{email ?? ""} {role && `· role:${role}`}</p>
          <Link to="/login" style={{ display: "inline-block", marginTop: 12, background: "#1c3147", color: "#fff", padding: "10px 16px", borderRadius: 999, textDecoration: "none", fontWeight: 600 }}>Login</Link>
        </div>
      </div>
    );
  }
  return (
    <AdminLayout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@400;500;600&display=swap');`}</style>
        <div style={{ background: "#fff", border: "1px solid #ebe8e3", borderRadius: 16, padding: 16 }}>
          <p style={{ fontSize: 11, letterSpacing: ".18em", color: "#c4a574", margin: 0, fontWeight: 700 }}>ADMIN — PESANAN TOKO</p>
          <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, margin: "6px 0 4px", color: "#1c3147" }}>Kelola Pesanan</h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>Total {stats.total} · Pending {stats.pending} · Proses {stats.in_progress} · Review {stats.review} · Selesai {stats.done} · Harga by WA.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 12 }}>
            {[{ k: "pending", l: "Pending", c: "#f59e0b" }, { k: "in_progress", l: "Proses", c: "#3b82f6" }, { k: "review", l: "Review", c: "#8b5cf6" }, { k: "done", l: "Selesai", c: "#10b981" }].map((s) => (
              <div key={s.k} style={{ background: "#f8f7f4", borderRadius: 12, padding: 12, textAlign: "center", border: "1px solid #ebe8e3" }}>
                <div style={{ width: 10, height: 10, borderRadius: 999, background: s.c, margin: "0 auto 6px" }} />
                <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: ".08em" }}>{s.l.toUpperCase()}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1c3147" }}>{(stats as Record<string, number>)[s.k]}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            {["all", "pending", "in_progress", "review", "done", "rejected"].map((s) => (
              <button key={s} onClick={() => setFilter(s)} style={{ ...pill, background: filter === s ? "#1c3147" : "#fff", color: filter === s ? "#fff" : "#6b7280", borderColor: filter === s ? "#1c3147" : "#ebe8e3" }}>{s}</button>
            ))}
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari tema / nama / WA" style={{ ...input, flex: "1 1 200px", maxWidth: 320 }} />
            <button onClick={load} style={{ ...input, cursor: "pointer", background: "#fff", fontWeight: 600 }}>Refresh</button>
          </div>
          {msg && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 10 }}>{msg}</p>}
        </div>

        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {!list.length ? (
            <div style={{ background: "#fff", border: "1px dashed #c4a57488", borderRadius: 14, padding: 22, textAlign: "center" }}>
              <p style={{ margin: 0, color: "#1c3147", fontWeight: 600 }}>Belum ada pesanan</p>
              <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 13 }}>Pesanan guest muncul di sini setelah submit /pesan.</p>
            </div>
          ) : list.map((o) => (
            <article key={o.id} style={{ background: "#fff", border: "1px solid #ebe8e3", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: 14, borderBottom: "1px solid #f0ece6" }}>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <b style={{ color: "#1c3147" }}>{o.template_slug}</b>
                    <span style={{ fontSize: 11, background: o.status === "done" ? "#10b981" : o.status === "pending" ? "#f59e0b" : o.status === "in_progress" ? "#3b82f6" : "#9aa", color: "#fff", padding: "3px 8px", borderRadius: 999 }}>{o.status}</span>
                    <span style={{ fontSize: 11, color: "#6b7280", border: "1px solid #ebe8e3", padding: "3px 8px", borderRadius: 999 }}>{o.payment_status}</span>
                    <span style={{ fontSize: 11, color: "#9aa" }}>{new Date(o.created_at).toLocaleString("id-ID")}</span>
                  </div>
                  <p style={{ margin: "8px 0 0", fontSize: 14 }}><b style={{ color: "#1c3147" }}>{o.contact_name}</b> <span style={{ color: "#6b7280" }}>· {o.contact_wa} {o.contact_email ? `· ${o.contact_email}` : ""}</span></p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>
                    {o.data?.groom_nick || o.data?.groom_full || o.data?.bride_nick ? `${String(o.data.groom_nick ?? "")} & ${String(o.data.bride_nick ?? "")} · Akad: ${String(o.data.akad_date ?? "-")} ${String(o.data.akad_time ?? "")}` : Object.entries(o.data ?? {}).slice(0, 4).map(([k, v]) => `${k}:${String(v).slice(0, 18)}`).join(" · ")}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", height: "fit-content" }}>
                  <select value={o.status} onChange={(e) => patch(o.id, { status: e.target.value })} style={input}>
                    <option value="pending">pending</option><option value="in_progress">in_progress</option><option value="review">review</option><option value="done">done</option><option value="rejected">rejected</option>
                  </select>
                  <Link to={`/${o.template_slug}?to=Tamu`} style={{ fontSize: 12, color: "#c4a574", textDecoration: "none", border: "1px solid #c4a574", padding: "7px 10px", borderRadius: 999 }}>Demo</Link>
                  <Link to={`/dashboard/new?template=${o.template_slug}&order=${o.id}`} style={{ fontSize: 12, background: "#1c3147", color: "#fff", padding: "7px 12px", borderRadius: 999, textDecoration: "none", fontWeight: 600 }}>Buatkan</Link>
                </div>
              </div>
              <details style={{ padding: "10px 14px" }}>
                <summary style={{ cursor: "pointer", fontSize: 12, color: "#1c3147", fontWeight: 600 }}>Data lengkap + JSON</summary>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 8, marginTop: 10, fontSize: 12 }}>
                  {Object.entries(o.data ?? {}).map(([k, v]) => (
                    <div key={k} style={{ background: "#f8f7f4", borderRadius: 10, padding: 10, border: "1px solid #ebe8e3" }}>
                      <div style={{ fontSize: 10, letterSpacing: ".08em", color: "#9aa", fontWeight: 700 }}>{k}</div>
                      <div style={{ marginTop: 4, color: "#1c3147", wordBreak: "break-word" }}>{String(v ?? "-").slice(0, 200) || "-"}</div>
                    </div>
                  ))}
                </div>
                <pre style={{ fontSize: 11, overflow: "auto", background: "#f8f7f4", padding: 12, borderRadius: 12, marginTop: 10, border: "1px solid #ebe8e3" }}>{JSON.stringify(o.data, null, 2).slice(0, 5000)}</pre>
              </details>
            </article>
          ))}
        </div>

        <div style={{ marginTop: 18, background: "#fff", border: "1px solid #ebe8e3", borderRadius: 16, padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 14, color: "#1c3147" }}>Laporan</h3>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
            Total {stats.total} pesanan · Bulan ini {orders.filter((x) => new Date(x.created_at).getMonth() === new Date().getMonth()).length} · Selesai {stats.done} · Semua by WA. Foto tersimpan di GDrive folder <code>order-xxxx-tema</code> (lihat guest_order_files). Tombol Buatkan → /dashboard/new?template=slug buka Editor admin untuk generate published link.
          </p>
        </div>
    </AdminLayout>
  );
}
