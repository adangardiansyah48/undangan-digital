import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API } from "../lib/api";
export default function Katalog() {
    const [sp] = useSearchParams();
    const cat = sp.get("cat") ?? "all";
    const [items, setItems] = useState([]);
    useEffect(() => { fetch(`${API}/api/templates${cat === "all" ? "" : `?cat=${cat}`}`).then(r => r.json()).then(setItems).catch(() => setItems([])); }, [cat]);
    return (_jsxs("main", { style: { padding: 24, maxWidth: 1100, margin: "0 auto" }, children: [_jsx("h1", { children: "Katalog" }), _jsx("nav", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: ["all", "wedding", "adat", "animasi", "non-wedding"].map(c => _jsx(Link, { to: c === "all" ? "/katalog" : `/katalog?cat=${c}`, style: { fontWeight: cat === c ? 700 : 400 }, children: c }, c)) }), _jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16, marginTop: 24 }, children: items.map(t => _jsxs("div", { style: { border: "1px solid #ddd", borderRadius: 12, padding: 16 }, children: [_jsx("strong", { children: t.title }), " ", _jsxs("small", { children: [t.category, " ", t.is_premium ? "· Premium" : ""] }), _jsx("p", { style: { opacity: 0.7 }, children: t.description }), _jsx(Link, { to: `/preview/${t.slug}`, children: "Preview" }), " ", " · ", " ", _jsx(Link, { to: `/dashboard/new?template=${t.slug}`, children: "Pakai" })] }, t.slug)) }), !items.length && _jsx("p", { children: "Memuat\u2026 atau backend belum jalan." })] }));
}
