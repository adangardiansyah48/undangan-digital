import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, API } from "../lib/api";
import { authHeader } from "../lib/supabase";
import { DEFAULT_DATA, type InvData, mergeData } from "../lib/invitation";

export default function Editor() {
  const { id } = useParams();
  const [raw, setRaw] = useState<InvData | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("draft");
  const [d, setD] = useState<InvData>(DEFAULT_DATA);
  const [msg, setMsg] = useState<string | null>(null);
  const [guests, setGuests] = useState<{ id: string; name: string }[]>([]);
  const [guestName, setGuestName] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
    } catch (e) { setMsg((e as Error).message); }
  }
  async function addGuest(e: React.FormEvent) {
    e.preventDefault();
    const r = await api(`/api/invitations/${id}/guests`, { method: "POST", body: JSON.stringify({ name: guestName }) });
    setGuests((v) => [r, ...v]); setGuestName("");
  }
  async function upload() {
    if (!file) return;
    const h = await authHeader();
    const fd = new FormData(); fd.set("file", file);
    const res = await fetch(`${API}/api/invitations/${id}/gallery`, { method: "POST", headers: h as never, body: fd });
    if (!res.ok) { const b = await res.json(); setMsg(b.error); return; }
    const row = await res.json();
    setD((v) => ({ ...v, gallery: [...(v.gallery ?? []), row.url] }));
    setMsg("Upload OK"); setFile(null);
  }

  const addEvent = () => setD((v) => ({ ...v, events: [...(v.events ?? []), { title: "Acara Baru", date: "Sabtu, 12 Desember 2025", time: "Pukul 10.00 WIB", place: "Lokasi", loc: "Kota", maps: "" }] }));
  const rmEvent = (i: number) => setD((v) => ({ ...v, events: v.events?.filter((_, k) => k !== i) }));
  const rmGallery = (i: number) => setD((v) => ({ ...v, gallery: v.gallery?.filter((_, k) => k !== i) }));
  const addGift = () => setD((v) => ({ ...v, gift: [...(v.gift ?? []), { bank: "BCA", name: "", no: "" }] }));
  const rmGift = (i: number) => setD((v) => ({ ...v, gift: v.gift?.filter((_, k) => k !== i) }));

  if (!raw) return <main style={{ padding: 24 }}>{msg ?? "Loading…"} <Link to="/dashboard">back</Link></main>;

  const input: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" };
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1>Editor {slug}</h1>
      <Link to={`/${slug}?to=CobaTamu`}>Lihat public</Link> {" · "} <Link to="/dashboard">Dashboard</Link> {" · "} <Link to={`/preview/${slug}`}>Preview</Link>
      <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
        <label>Judul <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label>Slug <input style={input} value={slug} onChange={(e) => setSlug(e.target.value)} /></label>
        <label>Status <select style={input} value={status} onChange={(e) => setStatus(e.target.value)}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>

        <fieldset style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
          <legend>Cover & Hero</legend>
          <label>Cover URL <input style={input} value={d.cover ?? ""} onChange={(e) => setD({ ...d, cover: e.target.value })} /></label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
            <label>Pasangan Pria <input style={input} value={d.couple?.groom ?? ""} onChange={(e) => setD({ ...d, couple: { ...d.couple!, groom: e.target.value } })} /></label>
            <label>Pasangan Wanita <input style={input} value={d.couple?.bride ?? ""} onChange={(e) => setD({ ...d, couple: { ...d.couple!, bride: e.target.value } })} /></label>
            <label>Orang tua wanita <input style={input} value={d.couple?.brideParents ?? ""} onChange={(e) => setD({ ...d, couple: { ...d.couple!, brideParents: e.target.value } })} /></label>
            <label>Orang tua pria <input style={input} value={d.couple?.groomParents ?? ""} onChange={(e) => setD({ ...d, couple: { ...d.couple!, groomParents: e.target.value } })} /></label>
          </div>
          <label style={{ marginTop: 8, display: "block" }}>Tanggal hero <input style={input} value={d.heroDate ?? ""} onChange={(e) => setD({ ...d, heroDate: e.target.value })} /></label>
          <label>Lokasi hero <input style={input} value={d.heroLoc ?? ""} onChange={(e) => setD({ ...d, heroLoc: e.target.value })} /></label>
          <label>Musik URL <input style={input} value={d.music ?? ""} onChange={(e) => setD({ ...d, music: e.target.value })} /></label>
        </fieldset>

        <fieldset style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
          <legend>Ayat</legend>
          <label>Ayat <textarea style={input} rows={3} value={d.ayat ?? ""} onChange={(e) => setD({ ...d, ayat: e.target.value })} /></label>
          <label>Cite <input style={input} value={d.ayatCite ?? ""} onChange={(e) => setD({ ...d, ayatCite: e.target.value })} /></label>
          <label>Countdown label <input style={input} value={d.countdownText ?? ""} onChange={(e) => setD({ ...d, countdownText: e.target.value })} /></label>
        </fieldset>

        <fieldset style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
          <legend>Acara {<button type="button" onClick={addEvent} style={{ marginLeft: 8 }}>+ Acara</button>}</legend>
          {(d.events ?? []).map((ev, i) => (
            <div key={i} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10, marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><b>{ev.title}</b><button type="button" onClick={() => rmEvent(i)}>Hapus</button></div>
              <label>Judul <input style={input} value={ev.title} onChange={(e) => setD({ ...d, events: d.events!.map((x, k) => k === i ? { ...x, title: e.target.value } : x) })} /></label>
              <label>Tanggal <input style={input} value={ev.date} onChange={(e) => setD({ ...d, events: d.events!.map((x, k) => k === i ? { ...x, date: e.target.value } : x) })} /></label>
              <label>Waktu <input style={input} value={ev.time} onChange={(e) => setD({ ...d, events: d.events!.map((x, k) => k === i ? { ...x, time: e.target.value } : x) })} /></label>
              <label>Tempat <input style={input} value={ev.place} onChange={(e) => setD({ ...d, events: d.events!.map((x, k) => k === i ? { ...x, place: e.target.value } : x) })} /></label>
              <label>Lokasi ringkas <input style={input} value={ev.loc} onChange={(e) => setD({ ...d, events: d.events!.map((x, k) => k === i ? { ...x, loc: e.target.value } : x) })} /></label>
              <label>Maps URL <input style={input} value={ev.maps ?? ""} onChange={(e) => setD({ ...d, events: d.events!.map((x, k) => k === i ? { ...x, maps: e.target.value } : x) })} /></label>
            </div>
          ))}
        </fieldset>

        <fieldset style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
          <legend>Galeri</legend>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {(d.gallery ?? []).map((u, i) => (
              <div key={`${u}-${i}`} style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
                <img src={u} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
                <button type="button" onClick={() => rmGallery(i)} style={{ width: "100%" }}>Hapus</button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <button type="button" onClick={upload} disabled={!file}>Upload</button>
          </div>
          <label style={{ marginTop: 8, display: "block" }}>Tambah URL manual <input style={input} placeholder="https://" onKeyDown={async (e) => { if (e.key === "Enter") { e.preventDefault(); const v = (e.target as HTMLInputElement).value.trim(); if (v) { setD((x) => ({ ...x, gallery: [...(x.gallery ?? []), v] })); (e.target as HTMLInputElement).value = ""; } } }} /></label>
          <label style={{ marginTop: 8, display: "block" }}>Love Story <textarea style={input} rows={3} value={d.loveStory ?? ""} onChange={(e) => setD({ ...d, loveStory: e.target.value })} /></label>
          <label>Closing <textarea style={input} rows={2} value={d.closing ?? ""} onChange={(e) => setD({ ...d, closing: e.target.value })} /></label>
        </fieldset>

        <fieldset style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
          <legend>Hadiah {<button type="button" onClick={addGift} style={{ marginLeft: 8 }}>+ Rekening</button>}</legend>
          {(d.gift ?? []).map((g, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, marginTop: 8 }}>
              <input style={input} placeholder="Bank" value={g.bank} onChange={(e) => setD({ ...d, gift: d.gift!.map((x, k) => k === i ? { ...x, bank: e.target.value } : x) })} />
              <input style={input} placeholder="a.n" value={g.name} onChange={(e) => setD({ ...d, gift: d.gift!.map((x, k) => k === i ? { ...x, name: e.target.value } : x) })} />
              <input style={input} placeholder="No" value={g.no} onChange={(e) => setD({ ...d, gift: d.gift!.map((x, k) => k === i ? { ...x, no: e.target.value } : x) })} />
              <button type="button" onClick={() => rmGift(i)}>Hapus</button>
            </div>
          ))}
        </fieldset>

        <button onClick={save} style={{ padding: "14px", borderRadius: 999, border: 0, background: "#1c3147", color: "#fff", fontWeight: 600 }}>Simpan & Publish</button>
        {msg && <p>{msg}</p>}
        <hr />
        <h3>Tamu</h3>
        <form onSubmit={addGuest} style={{ display: "flex", gap: 8 }}>
          <input style={input} value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Nama tamu" />
          <button>Tambah</button>
        </form>
        {guests.map((g) => <div key={g.id}>{g.name} <Link to={`/${slug}?to=${encodeURIComponent(g.name)}`}>link</Link></div>)}
      </div>
    </main>
  );
}
