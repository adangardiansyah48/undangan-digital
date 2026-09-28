import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
export default function Login({ mode }: { mode?: "register" }) {
  const nav = useNavigate();
  const isReg = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setMsg(null); setLoading(true);
    try {
      if (isReg) {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
        if (error) throw error; setMsg("Cek email untuk verifikasi. Lalu login sebagai admin.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error; nav("/admin");
      }
    } catch (e2) { setErr((e2 as Error).message); } finally { setLoading(false); }
  }
  async function google() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/admin` } });
    if (error) setErr(error.message);
  }
  const input: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 999, border: "1px solid #ebe8e3", fontSize: 14, background: "#fff" };
  return (
    <div style={{ minHeight: "100svh", background: "#f8f7f4", fontFamily: "Outfit,system-ui,sans-serif", display: "grid", placeItems: "center", padding: 16 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@400;500;600&display=swap');`}</style>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", justifyContent: "center", marginBottom: 18 }}>
          <img src="/logo.svg" alt="mstory.id" style={{ height: 38, width: "auto" }} />
          <span style={{ fontSize: 10, background: "#1c3147", color: "#fff", borderRadius: 999, padding: "4px 8px", letterSpacing: ".12em", fontWeight: 600 }}>ADMIN</span>
        </Link>
        <div style={{ background: "#fff", border: "1px solid #ebe8e3", borderRadius: 16, padding: 20, boxShadow: "0 12px 32px rgba(28,49,71,.06)" }}>
          <p style={{ fontSize: 11, letterSpacing: ".18em", color: "#c4a574", margin: 0, fontWeight: 700, textAlign: "center" }}>MSTORE ADMIN</p>
          <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, margin: "6px 0 4px", color: "#1c3147", textAlign: "center" }}>{isReg ? "Daftar Akun" : "Masuk Admin"}</h1>
          <p style={{ margin: "0 0 16px", color: "#6b7280", fontSize: 13, textAlign: "center" }}>{isReg ? "Buat akun, nanti set role admin di Supabase." : "Login untuk kelola pesanan katalog 60."}</p>
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            {isReg && <input placeholder="Nama lengkap" value={name} onChange={(e) => setName(e.target.value)} required style={input} />}
            <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={input} />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={input} />
            <button type="submit" disabled={loading} style={{ padding: "12px", borderRadius: 999, border: 0, background: "#1c3147", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>{loading ? "Memproses…" : isReg ? "Daftar" : "Masuk"}</button>
          </form>
          <button onClick={google} style={{ marginTop: 10, width: "100%", padding: "11px", borderRadius: 999, border: "1px solid #ebe8e3", background: "#fff", color: "#1c3147", fontWeight: 600, cursor: "pointer" }}>Masuk dengan Google</button>
          {err && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 12, textAlign: "center" }}>{err}</p>}
          {msg && <p style={{ color: "#0a7", fontSize: 13, marginTop: 12, textAlign: "center" }}>{msg}</p>}
          <p style={{ marginTop: 16, fontSize: 13, textAlign: "center", color: "#6b7280" }}>
            {isReg ? <><Link to="/login" style={{ color: "#1c3147", fontWeight: 600 }}>Sudah punya akun? Masuk</Link></> : <><Link to="/register" style={{ color: "#1c3147", fontWeight: 600 }}>Belum punya akun? Daftar</Link></>}
            <span style={{ margin: "0 8px", color: "#ddd" }}>·</span><Link to="/" style={{ color: "#6b7280" }}>Katalog</Link>
          </p>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#9aa", marginTop: 14 }}>Harga by WA · Guest order tanpa login · Admin kelola di /admin</p>
      </div>
    </div>
  );
}
