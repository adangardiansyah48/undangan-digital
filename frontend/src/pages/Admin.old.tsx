import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, authHeader } from "../lib/supabase";
import { API } from "../lib/api";
type OrderRow = { id: string; template_slug: string; status: string; payment_status: string; contact_name: string; contact_wa: string; data: Record<string, unknown>; created_at: string };
export default function Admin() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    supabase.from("profiles").select("role").maybeSingle().then(({ data }) => setRole(data?.role ?? null));
    load();
  }, []);
  async function load() {
    const h = await authHeader();
    const r = await fetch(`${API}/api/guest-orders`, { headers: h });
    const j = await r.json().catch(() => []);
    if (Array.isArray(j)) setOrders(j); else setMsg(j.error ?? "load fail");
  }
  async function patch(id: string, patch: Record<string, string>) {
    const h = await authHeader();
    const r = await fetch(`${API}/api/guest-orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...h }, body: JSON.stringify(patch) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) setMsg(j.error ?? "update fail"); else load();
  }
  const list = orders.filter((o) => (filter === "all" || o.status === filter) && (!q || o.template_slug.includes(q) || o.contact_name.toLowerCase().includes(q.toLowerCase()) || o.contact_wa.includes(q)));
  const stats = { total: orders.length, pending: orders.filter((x) => x.status === "pending").length, in_progress: orders.filter((x) => x.status === "in_progress").length, done: orders.filter((x) => x.status === "done").length };
  const input: React.CSSProperties = { padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", fontSize: 13 };
  if (role && !["admin","superadmin"].includes(role)) return <main style={{ padding: 24 }}>Akses admin saja. Login sebagai admin. <Link to="/login">Login</Link> {email && <small>({email} role:{role})</small>}</main>;
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 18, fontFamily: "Outfit,system-ui,sans-serif" }}>
      <Link to="/">← Katalog</Link> <Link to="/dashboard" style={{ marginLeft: 12 }}>Dashboard</Link>
      <h1 style={{ margin: "10px 0 4px" }}>Admin — Pesanan</h1>
      <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>{email ?? ""} {role && `· ${role}`} · Total {stats.total} · Pending {stats.pending} · Proses {stats.in_progress} · Selesai {stats.done}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {["all","pending","in_progress","review","done","rejected"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "6px 12px", borderRadius: 999, border: filter === s ? "1px solid #1c3147" : "1px solid #ddd", background: filter === s ? "#1c3147" : "#fff", color: filter === s ? "#fff" : "#1c3147", cursor: "pointer" }}>{s}</button>
        ))}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari tema / nama / WA" style={input} />
        <button onClick={load} style={{ ...input, cursor: "pointer" }}>Refresh</button>
      </div>
      {msg && <p style={{ color: "crimson" }}>{msg}</p>}
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {!list.length ? <p style={{ color: "#6b7280" }}>Belum ada pesanan.</p> : list.map((o) => (
          <article key={o.id} style={{ border: "1px solid #e8e8e8", borderRadius: 14, padding: 14, background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <b style={{ color: "#1c3147" }}>{o.template_slug}</b> <span style={{ fontSize: 11, background: o.status === "done" ? "#10b981" : o.status === "pending" ? "#f59e0b" : "#ddd", color: "#fff", padding: "3px 8px", borderRadius: 999 }}>{o.status}</span> <span style={{ fontSize: 11, color: "#6b7280" }}>{o.payment_status}</span>
                <p style={{ margin: "6px 0 0", fontSize: 13 }}><b>{o.contact_name}</b> · {o.contact_wa} · {new Date(o.created_at).toLocaleString("id-ID")}</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>{Object.entries(o.data ?? {}).slice(0, 6).map(([k, v]) => `${k}: ${String(v).slice(0, 40)}`).join(" · ")}</p>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <select value={o.status} onChange={(e) => patch(o.id, { status: e.target.value })} style={input}>
                  <option value="pending">pending</option><option value="in_progress">in_progress</option><option value="review">review</option><option value="done">done</option><option value="rejected">rejected</option>
                </select>
                <Link to={`/${o.template_slug}?to=Tamu`} style={{ fontSize: 12, color: "#c4a574" }}>Demo</Link>
                <Link to={`/dashboard/new?template=${o.template_slug}&order=${o.id}`} style={{ fontSize: 12, background: "#1c3147", color: "#fff", padding: "6px 10px", borderRadius: 999, textDecoration: "none" }}>Buatkan</Link>
              </div>
            </div>
            <details style={{ marginTop: 8 }}><summary style={{ cursor: "pointer", fontSize: 12, color: "#1c3147" }}>Data lengkap JSON</summary><pre style={{ fontSize: 11, overflow: "auto", background: "#f8f7f4", padding: 10, borderRadius: 10 }}>{JSON.stringify(o.data, null, 2).slice(0, 4000)}</pre></details>
          </article>
        ))}
      </div>
      <div style={{ marginTop: 20, padding: 14, border: "1px solid #ebe8e3", borderRadius: 14, background: "#fff7ed" }}>
        <b>Laporan</b>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6b7280" }}>Total pesanan {stats.total} · Bulan ini {orders.filter((x) => new Date(x.created_at).getMonth() === new Date().getMonth()).length} · Selesai {stats.done} · By handle WA. Kelola foto via GDrive folder order-xxx.</p>
      </div>
    </main>
  );
}
