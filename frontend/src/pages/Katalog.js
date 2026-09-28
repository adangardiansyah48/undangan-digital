import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API } from "../lib/api";
const FALLBACK = [
    { slug: "demo41", category: "adat", title: "Vony & Kay — Adat Jawa Navy", description: "Demo 41 · kebaya navy bordir, beskap batik cokelat-emas. Musik, gallery klik, staggered 1.6s.", is_premium: true, thumbnail_url: "/demo41/cover.jpg" },
    { slug: "elegant-ivory", category: "wedding", title: "Elegant Ivory", description: "Putih gading + gold, foto bulat couple.", is_premium: false, thumbnail_url: "/demo41/g2.jpg" },
    { slug: "sunda-siger", category: "adat", title: "Sunda Siger", description: "Sunda elegan, palette dusty teal.", is_premium: true, thumbnail_url: "/demo41/g3.jpg" },
    { slug: "minimal-anim", category: "animasi", title: "Minimal Anim", description: "Animasi smooth ken burns.", is_premium: false, thumbnail_url: "/demo41/g7.jpg" },
    { slug: "aqiqah-pastel", category: "non-wedding", title: "Aqiqah Pastel", description: "Non-wedding pastel.", is_premium: false, thumbnail_url: "/demo41/g5.jpg" },
];
export default function Katalog() {
    const [sp] = useSearchParams();
    const cat = sp.get("cat") ?? "all";
    const [items, setItems] = useState([]);
    useEffect(() => {
        fetch(`${API}/api/templates${cat === "all" ? "" : `?cat=${cat}`}`)
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((d) => { if (Array.isArray(d) && d.length)
            setItems(d);
        else
            setItems(FALLBACK.filter((x) => cat === "all" || x.category === cat)); })
            .catch(() => setItems(FALLBACK.filter((x) => cat === "all" || x.category === cat)));
    }, [cat]);
    const list = items.length ? items : FALLBACK.filter((x) => cat === "all" || x.category === cat);
    const featured = FALLBACK[0];
    const grid = list.filter((x) => x.slug !== "demo41");
    return (_jsxs("main", { style: { padding: 24, maxWidth: 1100, margin: "0 auto", fontFamily: "Outfit,system-ui,sans-serif" }, children: [_jsx("style", { children: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Outfit:wght@400;500&display=swap');` }), _jsx("h1", { style: { fontFamily: "Cormorant Garamond,serif", color: "#1c3147", margin: 0 }, children: "Katalog" }), _jsx("nav", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }, children: ["all", "wedding", "adat", "animasi", "non-wedding"].map((c) => (_jsx(Link, { to: c === "all" ? "/katalog" : `/katalog?cat=${c}`, style: { fontWeight: cat === c ? 700 : 400, color: "#1c3147", textDecoration: "none", border: cat === c ? "1px solid #c4a574" : "1px solid transparent", padding: "6px 10px", borderRadius: 999 }, children: c }, c))) }), _jsxs(Link, { to: "/example?to=Tamu%20Undangan", style: { textDecoration: "none", color: "inherit", display: "block", marginTop: 20, border: "1px solid #c4a57455", borderRadius: 16, overflow: "hidden", boxShadow: "0 12px 32px #1c31470f", background: "#fff" }, children: [_jsx("img", { src: featured.thumbnail_url ?? "/demo41/cover.jpg", alt: "", style: { width: "100%", aspectRatio: "16/9", objectFit: "cover" } }), _jsxs("div", { style: { padding: 16 }, children: [_jsxs("span", { style: { fontSize: 11, letterSpacing: ".18em", color: "#c4a574", textTransform: "uppercase" }, children: ["No.1 \u00B7 ", featured.category, " \u2014 Featured"] }), _jsx("h2", { style: { margin: "6px 0 4px", color: "#1c3147" }, children: featured.title }), _jsx("p", { style: { margin: 0, color: "#5a6570", fontSize: 13 }, children: featured.description }), _jsx("span", { style: { display: "inline-block", marginTop: 12, background: "#c4a574", color: "#fff", padding: "9px 16px", borderRadius: 999, fontSize: 13 }, children: "Lihat Demo \u2192 /example" })] })] }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16, marginTop: 20 }, children: [grid.map((t) => (_jsxs("div", { style: { border: "1px solid #ddd", borderRadius: 12, padding: 16, background: "#fff" }, children: [t.thumbnail_url && _jsx("img", { src: t.thumbnail_url, alt: "", style: { width: "100%", aspectRatio: "16/10", objectFit: "cover", borderRadius: 8, marginBottom: 8 } }), _jsx("strong", { style: { color: "#1c3147" }, children: t.title }), " ", _jsxs("small", { style: { color: "#5a6570" }, children: [t.category, " ", t.is_premium ? "· Premium" : ""] }), _jsx("p", { style: { opacity: 0.7, fontSize: 13, margin: "6px 0 10px" }, children: t.description }), t.slug === "demo41" ? _jsx(Link, { to: "/example?to=Tamu%20Undangan", children: "Lihat Demo" }) : _jsx(Link, { to: `/preview/${t.slug}`, children: "Preview" }), " ", " · ", " ", _jsx(Link, { to: `/dashboard/new?template=${t.slug}&track=self`, children: "Self" }), " ", " · ", " ", _jsx(Link, { to: `/dashboard/new?template=${t.slug}&track=assisted`, children: "Assisted" })] }, t.slug))), cat === "wedding" && grid.filter((x) => x.category === "wedding").length === 0 && (_jsx("div", { style: { border: "1px dashed #c4a57488", borderRadius: 12, padding: 16, background: "#fffdf6", display: "grid", placeItems: "center", minHeight: 160, textAlign: "center" }, children: _jsxs("div", { children: [_jsx("p", { style: { margin: 0, color: "#1c3147", fontWeight: 600 }, children: "Wedding \u2014 Demo 41" }), _jsx("p", { style: { margin: "6px 0 10px", color: "#5a6570", fontSize: 13 }, children: "Belum ada template wedding dari API \u00B7 lihat Demo 41 di atas" }), _jsx(Link, { to: "/example?to=Tamu%20Undangan", style: { color: "#c4a574" }, children: "Buka /example \u2192" })] }) }))] })] }));
}
