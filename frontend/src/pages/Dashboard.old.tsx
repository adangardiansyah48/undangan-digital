import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";
export default function Dashboard(){
  const [items,setItems]=useState<{id:string;slug:string;title:string;tier:string;status:string}[]>([]);
  const [email,setEmail]=useState<string|null>(null);
  useEffect(()=>{ supabase.auth.getUser().then(({data})=>setEmail(data.user?.email??null)); api("/api/invitations").then(setItems).catch(()=>setItems([])); },[]);
  return (
    <main style={{padding:24,maxWidth:900,margin:"0 auto"}}>
      <h1>Dashboard {email?`· ${email}`:""}</h1>
      <nav style={{display:"flex",gap:12,marginTop:8}}><Link to="/">Home</Link><Link to="/katalog">Katalog</Link><Link to="/dashboard/new">+ Baru</Link><Link to="/dashboard/settings">Settings</Link></nav>
      <div style={{marginTop:24}}>
        {!items.length? <p>Belum ada undangan. <Link to="/dashboard/new">Buat</Link>.</p> : items.map(i=> <div key={i.id} style={{border:"1px solid #ddd",borderRadius:12,padding:12,marginTop:8}}><Link to={`/dashboard/invitations/${i.id}`}>{i.title ?? i.slug} /{i.slug}</Link> <small>{i.tier} · {i.status}</small> <Link to={`/${i.slug}?to=CobaTamu`} style={{marginLeft:12}}>Public</Link></div>)}
      </div>
    </main>
  );
}
