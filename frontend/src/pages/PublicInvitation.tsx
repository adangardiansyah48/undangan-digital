import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { API } from "../lib/api";
export default function PublicInvitation({ preview }: { preview?: boolean }) {
  const { slug } = useParams();
  const [sp] = useSearchParams();
  const guest = sp.get("to");
  const [data,setData]=useState<{invitation:{slug:string;title:string;status:string;data:Record<string,unknown>};wishes:{guest_name:string;message:string}[];gallery:{url:string}[]}|null>(null);
  const [err,setErr]=useState<string|null>(null);
  const path = preview ? `/preview/${slug}` : `/api/invitations/by-slug/${slug}`;
  useEffect(()=>{ fetch(`${API}${path}${guest?`?to=${encodeURIComponent(guest)}`:""}`).then(async r=>{ if(!r.ok) throw new Error(await r.text()); return r.json();}).then(setData).catch(e=>setErr(e.message)); },[path,guest]);
  if(err) return <main style={{padding:24}}>Error: {err.slice(0,300)}</main>;
  if(!data) return <main style={{padding:24}}>Loading {slug}…</main>;
  const inv=data.invitation;
  const d=inv.data as { couple?:{bride:{name:string};groom:{name:string}} };
  const together = d?.couple ? `${d.couple.groom.name} & ${d.couple.bride.name}` : (inv.title ?? inv.slug);
  return (
    <main style={{maxWidth:520,margin:"0 auto",border:"1px solid #ddd",minHeight:"100svh",padding:24}}>
      <p style={{opacity:0.6}}>Kepada: {guest ?? "Tamu Undangan"} {preview && "(preview)"}</p>
      <h1>{together}</h1>
      <p>Status: {inv.status}</p>
      {!!data.gallery.length && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:16}}>{data.gallery.map((g,i)=><img key={i} src={g.url} alt="" style={{width:"100%",aspectRatio:"1",objectFit:"cover"}} />)}</div>}
      <h3 style={{marginTop:24}}>Ucapan</h3>
      {data.wishes.map((w,i)=><div key={i} style={{border:"1px solid #eee",padding:8,marginTop:8}}><b>{w.guest_name}</b><br/>{w.message}</div>)}
      {!data.wishes.length && <p>Belum ada ucapan.</p>}
    </main>
  );
}
