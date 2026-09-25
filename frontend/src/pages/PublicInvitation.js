import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { API } from "../lib/api";
export default function PublicInvitation({ preview }) {
    const { slug } = useParams();
    const [sp] = useSearchParams();
    const guest = sp.get("to");
    const [data, setData] = useState(null);
    const [err, setErr] = useState(null);
    const path = preview ? `/preview/${slug}` : `/api/invitations/by-slug/${slug}`;
    useEffect(() => { fetch(`${API}${path}${guest ? `?to=${encodeURIComponent(guest)}` : ""}`).then(async (r) => { if (!r.ok)
        throw new Error(await r.text()); return r.json(); }).then(setData).catch(e => setErr(e.message)); }, [path, guest]);
    if (err)
        return _jsxs("main", { style: { padding: 24 }, children: ["Error: ", err.slice(0, 300)] });
    if (!data)
        return _jsxs("main", { style: { padding: 24 }, children: ["Loading ", slug, "\u2026"] });
    const inv = data.invitation;
    const d = inv.data;
    const together = d?.couple ? `${d.couple.groom.name} & ${d.couple.bride.name}` : (inv.title ?? inv.slug);
    return (_jsxs("main", { style: { maxWidth: 520, margin: "0 auto", border: "1px solid #ddd", minHeight: "100svh", padding: 24 }, children: [_jsxs("p", { style: { opacity: 0.6 }, children: ["Kepada: ", guest ?? "Tamu Undangan", " ", preview && "(preview)"] }), _jsx("h1", { children: together }), _jsxs("p", { children: ["Status: ", inv.status] }), !!data.gallery.length && _jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }, children: data.gallery.map((g, i) => _jsx("img", { src: g.url, alt: "", style: { width: "100%", aspectRatio: "1", objectFit: "cover" } }, i)) }), _jsx("h3", { style: { marginTop: 24 }, children: "Ucapan" }), data.wishes.map((w, i) => _jsxs("div", { style: { border: "1px solid #eee", padding: 8, marginTop: 8 }, children: [_jsx("b", { children: w.guest_name }), _jsx("br", {}), w.message] }, i)), !data.wishes.length && _jsx("p", { children: "Belum ada ucapan." })] }));
}
