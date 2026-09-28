import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, authHeader } from "../lib/supabase";
import { API } from "../lib/api";
export default function Admin() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("all");
    const [q, setQ] = useState("");
    const [msg, setMsg] = useState(null);
    const [email, setEmail] = useState(null);
    const [role, setRole] = useState(null);
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
        supabase.from("profiles").select("role").maybeSingle().then(({ data }) => setRole(data?.role ?? null));
        load();
    }, []);
    async function load() {
        const h = await authHeader();
        const r = await fetch(`${API}/api/guest-orders`, { headers: h });
        const j = await r.json().catch(() => []);
        if (Array.isArray(j))
            setOrders(j);
        else
            setMsg(j.error ?? "load fail");
    }
    async function patch(id, patch) {
        const h = await authHeader();
        const r = await fetch(`${API}/api/guest-orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...h }, body: JSON.stringify(patch) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok)
            setMsg(j.error ?? "update fail");
        else
            load();
    }
    const list = orders.filter((o) => (filter === "all" || o.status === filter) && (!q || o.template_slug.includes(q) || o.contact_name.toLowerCase().includes(q.toLowerCase()) || o.contact_wa.includes(q)));
    const stats = { total: orders.length, pending: orders.filter((x) => x.status === "pending").length, in_progress: orders.filter((x) => x.status === "in_progress").length, done: orders.filter((x) => x.status === "done").length };
    const input = { padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", fontSize: 13 };
    if (role && !["admin", "superadmin"].includes(role))
        return _jsxs("main", { style: { padding: 24 }, children: ["Akses admin saja. Login sebagai admin. ", _jsx(Link, { to: "/login", children: "Login" }), " ", email && _jsxs("small", { children: ["(", email, " role:", role, ")"] })] });
    return (_jsxs("main", { style: { maxWidth: 1100, margin: "0 auto", padding: 18, fontFamily: "Outfit,system-ui,sans-serif" }, children: [_jsx(Link, { to: "/", children: "\u2190 Katalog" }), " ", _jsx(Link, { to: "/dashboard", style: { marginLeft: 12 }, children: "Dashboard" }), _jsx("h1", { style: { margin: "10px 0 4px" }, children: "Admin \u2014 Pesanan" }), _jsxs("p", { style: { margin: 0, color: "#6b7280", fontSize: 13 }, children: [email ?? "", " ", role && `· ${role}`, " \u00B7 Total ", stats.total, " \u00B7 Pending ", stats.pending, " \u00B7 Proses ", stats.in_progress, " \u00B7 Selesai ", stats.done] }), _jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }, children: [["all", "pending", "in_progress", "review", "done", "rejected"].map((s) => (_jsx("button", { onClick: () => setFilter(s), style: { padding: "6px 12px", borderRadius: 999, border: filter === s ? "1px solid #1c3147" : "1px solid #ddd", background: filter === s ? "#1c3147" : "#fff", color: filter === s ? "#fff" : "#1c3147", cursor: "pointer" }, children: s }, s))), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari tema / nama / WA", style: input }), _jsx("button", { onClick: load, style: { ...input, cursor: "pointer" }, children: "Refresh" })] }), msg && _jsx("p", { style: { color: "crimson" }, children: msg }), _jsx("div", { style: { display: "grid", gap: 12, marginTop: 16 }, children: !list.length ? _jsx("p", { style: { color: "#6b7280" }, children: "Belum ada pesanan." }) : list.map((o) => (_jsxs("article", { style: { border: "1px solid #e8e8e8", borderRadius: 14, padding: 14, background: "#fff" }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }, children: [_jsxs("div", { children: [_jsx("b", { style: { color: "#1c3147" }, children: o.template_slug }), " ", _jsx("span", { style: { fontSize: 11, background: o.status === "done" ? "#10b981" : o.status === "pending" ? "#f59e0b" : "#ddd", color: "#fff", padding: "3px 8px", borderRadius: 999 }, children: o.status }), " ", _jsx("span", { style: { fontSize: 11, color: "#6b7280" }, children: o.payment_status }), _jsxs("p", { style: { margin: "6px 0 0", fontSize: 13 }, children: [_jsx("b", { children: o.contact_name }), " \u00B7 ", o.contact_wa, " \u00B7 ", new Date(o.created_at).toLocaleString("id-ID")] }), _jsx("p", { style: { margin: "4px 0 0", fontSize: 12, color: "#6b7280" }, children: Object.entries(o.data ?? {}).slice(0, 6).map(([k, v]) => `${k}: ${String(v).slice(0, 40)}`).join(" · ") })] }), _jsxs("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }, children: [_jsxs("select", { value: o.status, onChange: (e) => patch(o.id, { status: e.target.value }), style: input, children: [_jsx("option", { value: "pending", children: "pending" }), _jsx("option", { value: "in_progress", children: "in_progress" }), _jsx("option", { value: "review", children: "review" }), _jsx("option", { value: "done", children: "done" }), _jsx("option", { value: "rejected", children: "rejected" })] }), _jsx(Link, { to: `/${o.template_slug}?to=Tamu`, style: { fontSize: 12, color: "#c4a574" }, children: "Demo" }), _jsx(Link, { to: `/dashboard/new?template=${o.template_slug}&order=${o.id}`, style: { fontSize: 12, background: "#1c3147", color: "#fff", padding: "6px 10px", borderRadius: 999, textDecoration: "none" }, children: "Buatkan" })] })] }), _jsxs("details", { style: { marginTop: 8 }, children: [_jsx("summary", { style: { cursor: "pointer", fontSize: 12, color: "#1c3147" }, children: "Data lengkap JSON" }), _jsx("pre", { style: { fontSize: 11, overflow: "auto", background: "#f8f7f4", padding: 10, borderRadius: 10 }, children: JSON.stringify(o.data, null, 2).slice(0, 4000) })] })] }, o.id))) }), _jsxs("div", { style: { marginTop: 20, padding: 14, border: "1px solid #ebe8e3", borderRadius: 14, background: "#fff7ed" }, children: [_jsx("b", { children: "Laporan" }), _jsxs("p", { style: { margin: "6px 0 0", fontSize: 13, color: "#6b7280" }, children: ["Total pesanan ", stats.total, " \u00B7 Bulan ini ", orders.filter((x) => new Date(x.created_at).getMonth() === new Date().getMonth()).length, " \u00B7 Selesai ", stats.done, " \u00B7 By handle WA. Kelola foto via GDrive folder order-xxx."] })] })] }));
}
