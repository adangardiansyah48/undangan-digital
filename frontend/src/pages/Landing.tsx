import { Link } from "react-router-dom";
export default function Landing() {
  return (
    <div style={{ fontFamily: "Outfit,system-ui,sans-serif", color: "#1c3147", background: "#f4f1ea", minHeight: "100svh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Great+Vibes&family=Outfit:wght@400;500&display=swap');`}</style>
      <header style={{ maxWidth: 1100, margin: "0 auto", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <b style={{ fontFamily: "Great Vibes,cursive", fontSize: 28, fontWeight: 400 }}>mstory.id</b>
        <nav style={{ display: "flex", gap: 10 }}>
          <Link to="/katalog" style={btn}>Katalog</Link>
          <Link to="/example?to=Tamu%20Undangan" style={{ ...btn, background: "#1c3147", color: "#f4f1ea" }}>Lihat Demo</Link>
        </nav>
      </header>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 20px 40px", display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", alignItems: "center" }}>
        <div>
          <p style={{ letterSpacing: ".32em", fontSize: 11, textTransform: "uppercase", color: "#4e6d7a", margin: 0 }}>Undangan Digital Hybrid</p>
          <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,6vw,56px)", lineHeight: 1.05, margin: "12px 0 10px" }}>
            Elegan. Cepat. <span style={{ fontFamily: "Great Vibes,cursive", color: "#c4a574", fontWeight: 400 }}>mstory.id</span>
          </h1>
          <p style={{ color: "#5a6570", lineHeight: 1.7, maxWidth: 520, margin: 0 }}>Pilih template, isi sendiri atau dibantu admin. Musik, galeri klik, countdown, RSVP — ringan di mobile.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
            <Link to="/katalog" style={cta}>Pilih Template</Link>
            <Link to="/dashboard" style={{ ...cta, background: "transparent", color: "#1c3147", border: "1px solid #1c314733" }}>Dashboard</Link>
          </div>
          <p style={{ marginTop: 14, fontSize: 12, color: "#8a929a" }}>Self · Assisted · Supabase · GDrive · Cloudflare</p>
        </div>
        <div style={{ borderRadius: 18, overflow: "hidden", border: "1px solid #c4a57455", boxShadow: "0 16px 40px #1c314714", background: "#fff" }}>
          <img src="/demo41/cover.jpg" alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
          <div style={{ padding: 14, textAlign: "center" }}>
            <p style={{ fontFamily: "Great Vibes,cursive", fontSize: 28, margin: 0, color: "#1c3147" }}>Vony & Kay</p>
            <p style={{ fontSize: 12, color: "#4e6d7a", margin: "2px 0 10px" }}>Sabtu, 12 Desember 2025 · Cimalaka</p>
            <Link to="/example?to=Tamu%20Undangan" style={{ ...btn, background: "#c4a574", color: "#fff", width: "100%", justifyContent: "center" }}>Buka Demo 41</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
const btn: React.CSSProperties = { display: "inline-flex", alignItems: "center", padding: "9px 14px", borderRadius: 999, border: "1px solid #1c314733", color: "#1c3147", textDecoration: "none", fontSize: 13 };
const cta: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "12px 20px", borderRadius: 999, background: "#c4a574", color: "#fffaf0", textDecoration: "none", fontWeight: 500 };
