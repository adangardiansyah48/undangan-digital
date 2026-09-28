import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";
export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [email, setEmail] = useState(null);
    useEffect(() => { supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null)); api("/api/invitations").then(setItems).catch(() => setItems([])); }, []);
    return (_jsxs("main", { style: { padding: 24, maxWidth: 900, margin: "0 auto" }, children: [_jsxs("h1", { children: ["Dashboard ", email ? `· ${email}` : ""] }), _jsxs("nav", { style: { display: "flex", gap: 12, marginTop: 8 }, children: [_jsx(Link, { to: "/", children: "Home" }), _jsx(Link, { to: "/katalog", children: "Katalog" }), _jsx(Link, { to: "/dashboard/new", children: "+ Baru" }), _jsx(Link, { to: "/dashboard/settings", children: "Settings" })] }), _jsx("div", { style: { marginTop: 24 }, children: !items.length ? _jsxs("p", { children: ["Belum ada undangan. ", _jsx(Link, { to: "/dashboard/new", children: "Buat" }), "."] }) : items.map(i => _jsxs("div", { style: { border: "1px solid #ddd", borderRadius: 12, padding: 12, marginTop: 8 }, children: [_jsxs(Link, { to: `/dashboard/invitations/${i.id}`, children: [i.title ?? i.slug, " /", i.slug] }), " ", _jsxs("small", { children: [i.tier, " \u00B7 ", i.status] }), " ", _jsx(Link, { to: `/${i.slug}?to=CobaTamu`, style: { marginLeft: 12 }, children: "Public" })] }, i.id)) })] }));
}
