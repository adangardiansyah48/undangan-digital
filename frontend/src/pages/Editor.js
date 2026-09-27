import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, API } from "../lib/api";
import { authHeader } from "../lib/supabase";
import { DEFAULT_DATA, mergeData } from "../lib/invitation";
export default function Editor() {
    const { id } = useParams();
    const [raw, setRaw] = useState(null);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [status, setStatus] = useState("draft");
    const [d, setD] = useState(DEFAULT_DATA);
    const [msg, setMsg] = useState(null);
    const [guests, setGuests] = useState([]);
    const [guestName, setGuestName] = useState("");
    const [file, setFile] = useState(null);
    useEffect(() => {
        api(`/api/invitations/${id}`).then((r) => {
            setRaw(r.invitation.data ?? {});
            setTitle(r.invitation.title ?? "");
            setSlug(r.invitation.slug);
            setStatus(r.invitation.status);
            setD(mergeData(r.invitation.data));
            setGuests(r.guests ?? []);
        }).catch(() => setMsg("load fail (login?)"));
    }, [id]);
    async function save() {
        try {
            await api(`/api/invitations/${id}`, { method: "PATCH", body: JSON.stringify({ title, slug, data: d, status }) });
            setMsg("Tersimpan");
        }
        catch (e) {
            setMsg(e.message);
        }
    }
    async function addGuest(e) {
        e.preventDefault();
        const r = await api(`/api/invitations/${id}/guests`, { method: "POST", body: JSON.stringify({ name: guestName }) });
        setGuests((v) => [r, ...v]);
        setGuestName("");
    }
    async function upload() {
        if (!file)
            return;
        const h = await authHeader();
        const fd = new FormData();
        fd.set("file", file);
        const res = await fetch(`${API}/api/invitations/${id}/gallery`, { method: "POST", headers: h, body: fd });
        if (!res.ok) {
            const b = await res.json();
            setMsg(b.error);
            return;
        }
        const row = await res.json();
        setD((v) => ({ ...v, gallery: [...(v.gallery ?? []), row.url] }));
        setMsg("Upload OK");
        setFile(null);
    }
    const addEvent = () => setD((v) => ({ ...v, events: [...(v.events ?? []), { title: "Acara Baru", date: "Sabtu, 12 Desember 2025", time: "Pukul 10.00 WIB", place: "Lokasi", loc: "Kota", maps: "" }] }));
    const rmEvent = (i) => setD((v) => ({ ...v, events: v.events?.filter((_, k) => k !== i) }));
    const rmGallery = (i) => setD((v) => ({ ...v, gallery: v.gallery?.filter((_, k) => k !== i) }));
    const addGift = () => setD((v) => ({ ...v, gift: [...(v.gift ?? []), { bank: "BCA", name: "", no: "" }] }));
    const rmGift = (i) => setD((v) => ({ ...v, gift: v.gift?.filter((_, k) => k !== i) }));
    if (!raw)
        return _jsxs("main", { style: { padding: 24 }, children: [msg ?? "Loading…", " ", _jsx(Link, { to: "/dashboard", children: "back" })] });
    const input = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" };
    return (_jsxs("main", { style: { maxWidth: 860, margin: "0 auto", padding: 24, fontFamily: "system-ui" }, children: [_jsxs("h1", { children: ["Editor ", slug] }), _jsx(Link, { to: `/${slug}?to=CobaTamu`, children: "Lihat public" }), " ", " · ", " ", _jsx(Link, { to: "/dashboard", children: "Dashboard" }), " ", " · ", " ", _jsx(Link, { to: `/preview/${slug}`, children: "Preview" }), _jsxs("div", { style: { display: "grid", gap: 14, marginTop: 16 }, children: [_jsxs("label", { children: ["Judul ", _jsx("input", { style: input, value: title, onChange: (e) => setTitle(e.target.value) })] }), _jsxs("label", { children: ["Slug ", _jsx("input", { style: input, value: slug, onChange: (e) => setSlug(e.target.value) })] }), _jsxs("label", { children: ["Status ", _jsxs("select", { style: input, value: status, onChange: (e) => setStatus(e.target.value), children: [_jsx("option", { value: "draft", children: "draft" }), _jsx("option", { value: "published", children: "published" }), _jsx("option", { value: "archived", children: "archived" })] })] }), _jsxs("fieldset", { style: { border: "1px solid #ddd", borderRadius: 12, padding: 14 }, children: [_jsx("legend", { children: "Cover & Hero" }), _jsxs("label", { children: ["Cover URL ", _jsx("input", { style: input, value: d.cover ?? "", onChange: (e) => setD({ ...d, cover: e.target.value }) })] }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }, children: [_jsxs("label", { children: ["Pasangan Pria ", _jsx("input", { style: input, value: d.couple?.groom ?? "", onChange: (e) => setD({ ...d, couple: { ...d.couple, groom: e.target.value } }) })] }), _jsxs("label", { children: ["Pasangan Wanita ", _jsx("input", { style: input, value: d.couple?.bride ?? "", onChange: (e) => setD({ ...d, couple: { ...d.couple, bride: e.target.value } }) })] }), _jsxs("label", { children: ["Orang tua wanita ", _jsx("input", { style: input, value: d.couple?.brideParents ?? "", onChange: (e) => setD({ ...d, couple: { ...d.couple, brideParents: e.target.value } }) })] }), _jsxs("label", { children: ["Orang tua pria ", _jsx("input", { style: input, value: d.couple?.groomParents ?? "", onChange: (e) => setD({ ...d, couple: { ...d.couple, groomParents: e.target.value } }) })] })] }), _jsxs("label", { style: { marginTop: 8, display: "block" }, children: ["Tanggal hero ", _jsx("input", { style: input, value: d.heroDate ?? "", onChange: (e) => setD({ ...d, heroDate: e.target.value }) })] }), _jsxs("label", { children: ["Lokasi hero ", _jsx("input", { style: input, value: d.heroLoc ?? "", onChange: (e) => setD({ ...d, heroLoc: e.target.value }) })] }), _jsxs("label", { children: ["Musik URL ", _jsx("input", { style: input, value: d.music ?? "", onChange: (e) => setD({ ...d, music: e.target.value }) })] })] }), _jsxs("fieldset", { style: { border: "1px solid #ddd", borderRadius: 12, padding: 14 }, children: [_jsx("legend", { children: "Ayat" }), _jsxs("label", { children: ["Ayat ", _jsx("textarea", { style: input, rows: 3, value: d.ayat ?? "", onChange: (e) => setD({ ...d, ayat: e.target.value }) })] }), _jsxs("label", { children: ["Cite ", _jsx("input", { style: input, value: d.ayatCite ?? "", onChange: (e) => setD({ ...d, ayatCite: e.target.value }) })] }), _jsxs("label", { children: ["Countdown label ", _jsx("input", { style: input, value: d.countdownText ?? "", onChange: (e) => setD({ ...d, countdownText: e.target.value }) })] })] }), _jsxs("fieldset", { style: { border: "1px solid #ddd", borderRadius: 12, padding: 14 }, children: [_jsxs("legend", { children: ["Acara ", _jsx("button", { type: "button", onClick: addEvent, style: { marginLeft: 8 }, children: "+ Acara" })] }), (d.events ?? []).map((ev, i) => (_jsxs("div", { style: { border: "1px solid #eee", borderRadius: 10, padding: 10, marginTop: 8 }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [_jsx("b", { children: ev.title }), _jsx("button", { type: "button", onClick: () => rmEvent(i), children: "Hapus" })] }), _jsxs("label", { children: ["Judul ", _jsx("input", { style: input, value: ev.title, onChange: (e) => setD({ ...d, events: d.events.map((x, k) => k === i ? { ...x, title: e.target.value } : x) }) })] }), _jsxs("label", { children: ["Tanggal ", _jsx("input", { style: input, value: ev.date, onChange: (e) => setD({ ...d, events: d.events.map((x, k) => k === i ? { ...x, date: e.target.value } : x) }) })] }), _jsxs("label", { children: ["Waktu ", _jsx("input", { style: input, value: ev.time, onChange: (e) => setD({ ...d, events: d.events.map((x, k) => k === i ? { ...x, time: e.target.value } : x) }) })] }), _jsxs("label", { children: ["Tempat ", _jsx("input", { style: input, value: ev.place, onChange: (e) => setD({ ...d, events: d.events.map((x, k) => k === i ? { ...x, place: e.target.value } : x) }) })] }), _jsxs("label", { children: ["Lokasi ringkas ", _jsx("input", { style: input, value: ev.loc, onChange: (e) => setD({ ...d, events: d.events.map((x, k) => k === i ? { ...x, loc: e.target.value } : x) }) })] }), _jsxs("label", { children: ["Maps URL ", _jsx("input", { style: input, value: ev.maps ?? "", onChange: (e) => setD({ ...d, events: d.events.map((x, k) => k === i ? { ...x, maps: e.target.value } : x) }) })] })] }, i)))] }), _jsxs("fieldset", { style: { border: "1px solid #ddd", borderRadius: 12, padding: 14 }, children: [_jsx("legend", { children: "Galeri" }), _jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }, children: (d.gallery ?? []).map((u, i) => (_jsxs("div", { style: { border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }, children: [_jsx("img", { src: u, alt: "", style: { width: "100%", aspectRatio: "1", objectFit: "cover" } }), _jsx("button", { type: "button", onClick: () => rmGallery(i), style: { width: "100%" }, children: "Hapus" })] }, `${u}-${i}`))) }), _jsxs("div", { style: { display: "flex", gap: 8, marginTop: 10 }, children: [_jsx("input", { type: "file", onChange: (e) => setFile(e.target.files?.[0] ?? null) }), _jsx("button", { type: "button", onClick: upload, disabled: !file, children: "Upload" })] }), _jsxs("label", { style: { marginTop: 8, display: "block" }, children: ["Tambah URL manual ", _jsx("input", { style: input, placeholder: "https://", onKeyDown: async (e) => { if (e.key === "Enter") {
                                            e.preventDefault();
                                            const v = e.target.value.trim();
                                            if (v) {
                                                setD((x) => ({ ...x, gallery: [...(x.gallery ?? []), v] }));
                                                e.target.value = "";
                                            }
                                        } } })] }), _jsxs("label", { style: { marginTop: 8, display: "block" }, children: ["Love Story ", _jsx("textarea", { style: input, rows: 3, value: d.loveStory ?? "", onChange: (e) => setD({ ...d, loveStory: e.target.value }) })] }), _jsxs("label", { children: ["Closing ", _jsx("textarea", { style: input, rows: 2, value: d.closing ?? "", onChange: (e) => setD({ ...d, closing: e.target.value }) })] })] }), _jsxs("fieldset", { style: { border: "1px solid #ddd", borderRadius: 12, padding: 14 }, children: [_jsxs("legend", { children: ["Hadiah ", _jsx("button", { type: "button", onClick: addGift, style: { marginLeft: 8 }, children: "+ Rekening" })] }), (d.gift ?? []).map((g, i) => (_jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, marginTop: 8 }, children: [_jsx("input", { style: input, placeholder: "Bank", value: g.bank, onChange: (e) => setD({ ...d, gift: d.gift.map((x, k) => k === i ? { ...x, bank: e.target.value } : x) }) }), _jsx("input", { style: input, placeholder: "a.n", value: g.name, onChange: (e) => setD({ ...d, gift: d.gift.map((x, k) => k === i ? { ...x, name: e.target.value } : x) }) }), _jsx("input", { style: input, placeholder: "No", value: g.no, onChange: (e) => setD({ ...d, gift: d.gift.map((x, k) => k === i ? { ...x, no: e.target.value } : x) }) }), _jsx("button", { type: "button", onClick: () => rmGift(i), children: "Hapus" })] }, i)))] }), _jsx("button", { onClick: save, style: { padding: "14px", borderRadius: 999, border: 0, background: "#1c3147", color: "#fff", fontWeight: 600 }, children: "Simpan & Publish" }), msg && _jsx("p", { children: msg }), _jsx("hr", {}), _jsx("h3", { children: "Tamu" }), _jsxs("form", { onSubmit: addGuest, style: { display: "flex", gap: 8 }, children: [_jsx("input", { style: input, value: guestName, onChange: (e) => setGuestName(e.target.value), placeholder: "Nama tamu" }), _jsx("button", { children: "Tambah" })] }), guests.map((g) => _jsxs("div", { children: [g.name, " ", _jsx(Link, { to: `/${slug}?to=${encodeURIComponent(g.name)}`, children: "link" })] }, g.id))] })] }));
}
