import { useEffect, useState } from "react";
import { supabase, authHeader } from "../lib/supabase";
import { API } from "../lib/api";
export default function Settings(){
  const [email,setEmail]=useState<string|null>(null);
  const [connected,setConnected]=useState<boolean|null>(null);
  const [msg,setMsg]=useState<string|null>(null);
  useEffect(()=>{ supabase.auth.getUser().then(({data})=>setEmail(data.user?.email??null)); (async()=>{ const h=await authHeader(); try{ const r=await fetch(`${API}/api/auth/gdrive/status`,{headers:h}); const d=await r.json(); setConnected(!!d.connected);}catch{ setConnected(false);} })(); },[]);
  async function connect(){ const h=await authHeader(); const r=await fetch(`${API}/api/auth/gdrive/url`,{headers:h}); const d=await r.json(); if(d.url) location.href=d.url; else setMsg(d.error); }
  async function disconnect(){ const h=await authHeader(); await fetch(`${API}/api/auth/gdrive`,{method:"DELETE",headers:h}); setConnected(false); }
  return (
    <main style={{maxWidth:560,margin:"0 auto",padding:24}}>
      <h1>Settings</h1>
      <p>{email??""}</p>
      <p>GDrive: {connected===null?"…":connected?"Terhubung ✓":"Belum"}</p>
      <button onClick={connect}>Hubungkan GDrive</button> <button onClick={disconnect}>Putuskan</button>
      {msg && <p style={{color:"crimson"}}>{msg}</p>}
    </main>
  );
}
