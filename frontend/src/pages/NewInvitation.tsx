import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
export default function NewInvitation(){
  const [sp]=useSearchParams();
  const preset=sp.get("template")??undefined;
  const nav=useNavigate();
  const [title,setTitle]=useState("");
  const [slug,setSlug]=useState("");
  const [tier,setTier]=useState("bronze");
  const [track,setTrack]=useState("self");
  const [brief,setBrief]=useState("");
  const [err,setErr]=useState<string|null>(null);
  async function submit(e:React.FormEvent){ e.preventDefault(); setErr(null); try{ const r=await api("/api/invitations",{method:"POST",body:JSON.stringify({title,slug,tier,track,templateSlug:preset,brief})}); nav(`/dashboard/invitations/${r.id}`);} catch(e){ setErr((e as Error).message);} }
  return (
    <main style={{maxWidth:560,margin:"0 auto",padding:24}}>
      <h1>Buat undangan {preset?`· ${preset}`:""}</h1>
      <form onSubmit={submit} style={{display:"grid",gap:12,marginTop:16}}>
        <input placeholder="Judul (Andi & Sari)" value={title} onChange={e=>setTitle(e.target.value)} />
        <input placeholder="Slug (andi-sari)" value={slug} onChange={e=>setSlug(e.target.value)} />
        <select value={tier} onChange={e=>setTier(e.target.value)}><option value="bronze">Bronze</option><option value="silver">Silver</option><option value="gold">Gold</option><option value="platinum">Platinum</option></select>
        <select value={track} onChange={e=>setTrack(e.target.value)}><option value="self">Saya edit sendiri</option><option value="assisted">Dibuatkan tim</option></select>
        {track==="assisted" && <textarea placeholder="Brief untuk desainer" value={brief} onChange={e=>setBrief(e.target.value)} rows={4} />}
        <button type="submit">Buat</button>
        {err && <p style={{color:"crimson"}}>{err}</p>}
      </form>
    </main>
  );
}
