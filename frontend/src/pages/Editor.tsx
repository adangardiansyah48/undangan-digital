import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, API } from "../lib/api";
import { authHeader } from "../lib/supabase";
export default function Editor(){
  const {id}=useParams();
  const [data,setData]=useState<Record<string,unknown>|null>(null);
  const [title,setTitle]=useState("");
  const [slug,setSlug]=useState("");
  const [status,setStatus]=useState("draft");
  const [json,setJson]=useState("{}");
  const [msg,setMsg]=useState<string|null>(null);
  const [guests,setGuests]=useState<{id:string;name:string}[]>([]);
  const [guestName,setGuestName]=useState("");
  const [file,setFile]=useState<File|null>(null);
  useEffect(()=>{ api(`/api/invitations/${id}`).then((r)=>{ setData(r.invitation); setTitle(r.invitation.title??""); setSlug(r.invitation.slug); setStatus(r.invitation.status); setJson(JSON.stringify(r.invitation.data??{},null,2)); setGuests(r.guests??[]); }).catch(()=>setMsg("load fail (login?)")); },[id]);
  async function save(){ try{ await api(`/api/invitations/${id}`,{method:"PATCH",body:JSON.stringify({title,slug,data:JSON.parse(json),status})}); setMsg("saved"); }catch(e){ setMsg((e as Error).message);} }
  async function addGuest(e:React.FormEvent){ e.preventDefault(); const r=await api(`/api/invitations/${id}/guests`,{method:"POST",body:JSON.stringify({name:guestName})}); setGuests(v=>[r,...v]); setGuestName(""); }
  async function upload(){ if(!file) return; const h=await authHeader(); const fd=new FormData(); fd.set("file",file); const res=await fetch(`${API}/api/invitations/${id}/gallery`,{method:"POST",headers:h as never,body:fd}); if(!res.ok){ const b=await res.json(); setMsg(b.error); return;} setMsg("upload ok"); setFile(null); }
  if(!data) return <main style={{padding:24}}>{msg ?? "loading…"} <Link to="/dashboard">back</Link></main>;
  return (
    <main style={{maxWidth:800,margin:"0 auto",padding:24}}>
      <h1>Editor {slug}</h1>
      <Link to={`/${slug}?to=CobaTamu`}>Lihat public</Link> {" · "} <Link to="/dashboard">Dashboard</Link>
      <div style={{display:"grid",gap:12,marginTop:16}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
        <input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="Slug" />
        <select value={status} onChange={e=>setStatus(e.target.value)}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select>
        <textarea value={json} onChange={e=>setJson(e.target.value)} rows={12} style={{fontFamily:"monospace"}} />
        <button onClick={save}>Simpan</button>
        {msg && <p>{msg}</p>}
        <hr/>
        <h3>Tamu</h3>
        <form onSubmit={addGuest} style={{display:"flex",gap:8}}><input value={guestName} onChange={e=>setGuestName(e.target.value)} placeholder="Nama tamu" /><button>Tambah</button></form>
        {guests.map(g=> <div key={g.id}>{g.name} <Link to={`/${slug}?to=${encodeURIComponent(g.name)}`}>link</Link></div>)}
        <hr/>
        <h3>Galeri (GDrive)</h3>
        <input type="file" onChange={e=>setFile(e.target.files?.[0]??null)} />
        <button onClick={upload} disabled={!file}>Upload</button>
      </div>
    </main>
  );
}
