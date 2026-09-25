import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
export default function Landing() {
    return (_jsxs("main", { style: { padding: 24, maxWidth: 900, margin: "0 auto" }, children: [_jsx("h1", { children: "Invora \u2014 Undangan Digital Hybrid" }), _jsx("p", { children: "Bikin sendiri atau dibuatkan tim. Backend Render + Frontend Cloudflare + Supabase + GDrive." }), _jsxs("nav", { style: { display: "flex", gap: 12, marginTop: 16 }, children: [_jsx(Link, { to: "/katalog", children: "Katalog" }), _jsx(Link, { to: "/login", children: "Login" }), _jsx(Link, { to: "/dashboard", children: "Dashboard" })] }), _jsxs("p", { style: { marginTop: 24, opacity: 0.7 }, children: ["API: ", import.meta.env.VITE_API_URL] })] }));
}
