import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, API } from "../lib/api";
import { authHeader } from "../lib/supabase";
export default function Editor() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [status, setStatus] = useState("draft");
    const [json, setJson] = useState("{}");
    const [msg, setMsg] = useState(null);
    const [guests, setGuests] = useState([]);
    const [guestName, setGuestName] = useState("");
    const [file, setFile] = useState(null);
    useEffect(() => { api(`/api/invitations/${id}`).then((r) => { setData(r.invitation); setTitle(r.invitation.title ?? ""); setSlug(r.invitation.slug); setStatus(r.invitation.status); setJson(JSON.stringify(r.invitation.data ?? {}, null, 2)); setGuests(r.guests ?? []); }).catch(() => setMsg("load fail (login?)")); }, [id]);
    async function save() { try {
        await api(`/api/invitations/${id}`, { method: "PATCH", body: JSON.stringify({ title, slug, data: JSON.parse(json), status }) });
        setMsg("saved");
    }
    catch (e) {
        setMsg(e.message);
    } }
    async function addGuest(e) { e.preventDefault(); const r = await api(`/api/invitations/${id}/guests`, { method: "POST", body: JSON.stringify({ name: guestName }) }); setGuests(v => [r, ...v]); setGuestName(""); }
    async function upload() { if (!file)
        return; const h = await authHeader(); const fd = new FormData(); fd.set("file", file); const res = await fetch(`${API}/api/invitations/${id}/gallery`, { method: "POST", headers: h, body: fd }); if (!res.ok) {
        const b = await res.json();
        setMsg(b.error);
        return;
    } setMsg("upload ok"); setFile(null); }
    if (!data)
        return _jsxs("main", { style: { padding: 24 }, children: [msg ?? "loading…", " ", _jsx(Link, { to: "/dashboard", children: "back" })] });
    return (_jsxs("main", { style: { maxWidth: 800, margin: "0 auto", padding: 24 }, children: [_jsxs("h1", { children: ["Editor ", slug] }), _jsx(Link, { to: `/${slug}?to=CobaTamu`, children: "Lihat public" }), " ", " · ", " ", _jsx(Link, { to: "/dashboard", children: "Dashboard" }), _jsxs("div", { style: { display: "grid", gap: 12, marginTop: 16 }, children: [_jsx("input", { value: title, onChange: e => setTitle(e.target.value), placeholder: "Title" }), _jsx("input", { value: slug, onChange: e => setSlug(e.target.value), placeholder: "Slug" }), _jsxs("select", { value: status, onChange: e => setStatus(e.target.value), children: [_jsx("option", { value: "draft", children: "draft" }), _jsx("option", { value: "published", children: "published" }), _jsx("option", { value: "archived", children: "archived" })] }), _jsx("textarea", { value: json, onChange: e => setJson(e.target.value), rows: 12, style: { fontFamily: "monospace" } }), _jsx("button", { onClick: save, children: "Simpan" }), msg && _jsx("p", { children: msg }), _jsx("hr", {}), _jsx("h3", { children: "Tamu" }), _jsxs("form", { onSubmit: addGuest, style: { display: "flex", gap: 8 }, children: [_jsx("input", { value: guestName, onChange: e => setGuestName(e.target.value), placeholder: "Nama tamu" }), _jsx("button", { children: "Tambah" })] }), guests.map(g => _jsxs("div", { children: [g.name, " ", _jsx(Link, { to: `/${slug}?to=${encodeURIComponent(g.name)}`, children: "link" })] }, g.id)), _jsx("hr", {}), _jsx("h3", { children: "Galeri (GDrive)" }), _jsx("input", { type: "file", onChange: e => setFile(e.target.files?.[0] ?? null) }), _jsx("button", { onClick: upload, disabled: !file, children: "Upload" })] })] }));
}
