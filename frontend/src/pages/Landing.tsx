import { Link } from "react-router-dom";
export default function Landing() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Invora — Undangan Digital Hybrid</h1>
      <p>Bikin sendiri atau dibuatkan tim. Backend Render + Frontend Cloudflare + Supabase + GDrive.</p>
      <nav style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Link to="/katalog">Katalog</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <p style={{ marginTop: 24, opacity: 0.7 }}>API: {import.meta.env.VITE_API_URL}</p>
    </main>
  );
}
