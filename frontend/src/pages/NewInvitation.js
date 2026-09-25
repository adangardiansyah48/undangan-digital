import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
export default function NewInvitation() {
    const [sp] = useSearchParams();
    const preset = sp.get("template") ?? undefined;
    const nav = useNavigate();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [tier, setTier] = useState("bronze");
    const [track, setTrack] = useState("self");
    const [brief, setBrief] = useState("");
    const [err, setErr] = useState(null);
    async function submit(e) { e.preventDefault(); setErr(null); try {
        const r = await api("/api/invitations", { method: "POST", body: JSON.stringify({ title, slug, tier, track, templateSlug: preset, brief }) });
        nav(`/dashboard/invitations/${r.id}`);
    }
    catch (e) {
        setErr(e.message);
    } }
    return (_jsxs("main", { style: { maxWidth: 560, margin: "0 auto", padding: 24 }, children: [_jsxs("h1", { children: ["Buat undangan ", preset ? `· ${preset}` : ""] }), _jsxs("form", { onSubmit: submit, style: { display: "grid", gap: 12, marginTop: 16 }, children: [_jsx("input", { placeholder: "Judul (Andi & Sari)", value: title, onChange: e => setTitle(e.target.value) }), _jsx("input", { placeholder: "Slug (andi-sari)", value: slug, onChange: e => setSlug(e.target.value) }), _jsxs("select", { value: tier, onChange: e => setTier(e.target.value), children: [_jsx("option", { value: "bronze", children: "Bronze" }), _jsx("option", { value: "silver", children: "Silver" }), _jsx("option", { value: "gold", children: "Gold" }), _jsx("option", { value: "platinum", children: "Platinum" })] }), _jsxs("select", { value: track, onChange: e => setTrack(e.target.value), children: [_jsx("option", { value: "self", children: "Saya edit sendiri" }), _jsx("option", { value: "assisted", children: "Dibuatkan tim" })] }), track === "assisted" && _jsx("textarea", { placeholder: "Brief untuk desainer", value: brief, onChange: e => setBrief(e.target.value), rows: 4 }), _jsx("button", { type: "submit", children: "Buat" }), err && _jsx("p", { style: { color: "crimson" }, children: err })] })] }));
}
