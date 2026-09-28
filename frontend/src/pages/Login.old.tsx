import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
export default function Login({ mode }: { mode?: "register" }) {
  const nav = useNavigate();
  const isReg = mode==="register";
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [msg,setMsg]=useState<string|null>(null);
  const [err,setErr]=useState<string|null>(null);
  async function submit(e:React.FormEvent){ e.preventDefault(); setErr(null); setMsg(null);
    if(isReg){ const {error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name}}}); if(error) setErr(error.message); else setMsg("Cek email untuk verifikasi."); }
    else { const {error}=await supabase.auth.signInWithPassword({email,password}); if(error) setErr(error.message); else nav("/dashboard"); }
  }
  async function google(){ const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:`${location.origin}/dashboard`}}); if(error) setErr(error.message); }
  return (
    <main style={{maxWidth:380,margin:"40px auto",padding:24}}>
      <h1>{isReg?"Daftar":"Masuk"}</h1>
      <form onSubmit={submit} style={{display:"grid",gap:12,marginTop:16}}>
        {isReg && <input placeholder="Nama" value={name} onChange={e=>setName(e.target.value)} required />}
        <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
        <button type="submit">{isReg?"Daftar":"Masuk"}</button>
      </form>
      <button onClick={google} style={{marginTop:12}}>Google</button>
      {err && <p style={{color:"crimson"}}>{err}</p>}
      {msg && <p>{msg}</p>}
      <p style={{marginTop:16}}>{isReg? <a href="/login">Sudah punya akun? Masuk</a> : <a href="/register">Belum punya akun? Daftar</a>}</p>
    </main>
  );
}
