import { Link } from "react-router-dom";
export default function Landing() {
  return (
    <div style={{ fontFamily: "Outfit,system-ui,sans-serif", color: "#14141a", background: "#fff", minHeight: "100svh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Great+Vibes&family=Outfit:wght@400;600&display=swap');`}</style>
      <header style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}>
        <b style={{ fontFamily: "Outfit,sans-serif", fontSize: 20, letterSpacing: "-.02em" }}>mstory<span style={{ color: "#888", fontWeight: 400 }}>.id</span> <span style={{ fontSize: 10, background: "#111", color: "#fff", borderRadius: 999, padding: "3px 8px", verticalAlign: "middle", letterSpacing: ".12em" }}>ELEGANT</span></b>
        <nav style={{ display: "flex", gap: 18, fontSize: 14, alignItems: "center" }}>
          <Link to="/katalog" style={{ color: "#14141a", textDecoration: "none", fontWeight: 500 }}>Katalog</Link>
          <Link to="/dashboard" style={{ color: "#666", textDecoration: "none" }}>Dashboard</Link>
          <a href="https://wa.me/6281234567890?text=Halo%20mstory" target="_blank" rel="noreferrer" style={{ background: "#111", color: "#fff", borderRadius: 999, padding: "9px 16px", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>Chat WA</a>
        </nav>
      </header>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 28px", display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", alignItems: "center" }}>
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid #e8e8e8", background: "#f8f8f8", borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 600 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "#10b981", display: "inline-block" }} />Undangan digital · Edit sendiri atau dibantu tim</span>
          <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(36px,6vw,54px)", lineHeight: .95, margin: "16px 0 12px" }}>
            Undangan <span style={{ fontStyle: "italic", fontWeight: 400 }}>cantik</span>,<br />jadi dalam menit.
          </h1>
          <p style={{ color: "#6b7280", lineHeight: 1.6, maxWidth: 520, margin: 0, fontSize: 15 }}>Pilih desain fresh, isi data mempelai, upload foto, sebar satu link untuk semua tamu. Atau serahkan ke tim — kamu tinggal approve.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <Link to="/katalog" style={cta}>Lihat Katalog Desain</Link>
            <Link to="/dashboard" style={{ ...cta, background: "#fff", color: "#111", border: "1px solid #ddd" }}>Bikin Sendiri Gratis</Link>
          </div>
          <p style={{ marginTop: 10, fontSize: 13, color: "#6b7280" }}>Atau <a href="https://wa.me/6281234567890?text=Halo,%20mau%20dibantu%20buatkan%20undangan" target="_blank" rel="noreferrer" style={{ color: "#111", fontWeight: 600 }}>chat WA dibuatkan tim</a></p>
        </div>
        <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid #eee", boxShadow: "0 20px 50px #1111", background: "#fff", maxWidth: 380, justifySelf: "center", width: "100%" }}>
          <div style={{ height: 4, background: "#111" }} />
          <div style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, letterSpacing: ".15em", color: "#9aa" }}><span>THE WEDDING OF</span><span>12 · 12 · 2025</span></div>
            <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, textAlign: "center", margin: "10px 0 4px" }}>Andi & Sari</p>
            <p style={{ textAlign: "center", fontSize: 12, color: "#6b7280", margin: 0 }}>Gedung Serbaguna · 09.00 WIB</p>
            <img src="/demo41/cover.jpg" alt="" style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", borderRadius: 14, marginTop: 14 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 14 }}>
              {["12 Hari", "08 Jam", "24 Menit", "10 Detik"].map((t) => (
                <div key={t} style={{ border: "1px solid #eee", background: "#fafafa", borderRadius: 14, padding: "10px 0", textAlign: "center" }}><b>{t.split(" ")[0]}</b><div style={{ fontSize: 10, color: "#888" }}>{t.split(" ")[1]}</div></div>
              ))}
            </div>
            <Link to="/example?to=Tamu%20Undangan" style={{ display: "block", textAlign: "center", background: "#111", color: "#fff", borderRadius: 999, padding: "12px", marginTop: 14, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>Buka Undangan</Link>
            <p style={{ textAlign: "center", fontSize: 12, color: "#888", margin: "8px 0 0" }}>Kepada: Adang & Keluarga</p>
          </div>
        </div>
      </section>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 20px 40px" }}>
        <p style={{ textAlign: "center", fontSize: 11, letterSpacing: ".18em", color: "#888", fontWeight: 600 }}>DUA CARA MEMESAN</p>
        <h2 style={{ textAlign: "center", fontFamily: "Cormorant Garamond,serif", fontSize: 30, margin: "6px 0 4px" }}>Pilih yang paling gampang</h2>
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", maxWidth: 900, margin: "18px auto 0" }}>
          <div style={{ border: "1px solid #eee", borderRadius: 20, padding: 20, background: "#fff" }}>
            <span style={{ fontSize: 10, letterSpacing: ".14em", background: "#111", color: "#fff", borderRadius: 999, padding: "4px 10px" }}>01 · EDIT SENDIRI</span>
            <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, margin: "12px 0 6px" }}>Bikin sendiri 5 menit</h3>
            <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>Pilih template → isi data → publish. Link siap share WA.</p>
            <Link to="/dashboard" style={{ display: "block", textAlign: "center", background: "#111", color: "#fff", borderRadius: 999, padding: "12px", marginTop: 14, textDecoration: "none", fontWeight: 600 }}>Coba Editor Gratis</Link>
          </div>
          <div style={{ borderRadius: 20, padding: 20, background: "#111", color: "#fff" }}>
            <span style={{ fontSize: 10, letterSpacing: ".14em", background: "#ffffff22", borderRadius: 999, padding: "4px 10px" }}>02 · DIBANTU TIM</span>
            <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, margin: "12px 0 6px" }}>Dibuatkan tim 1–2 hari</h3>
            <p style={{ color: "#bbb", fontSize: 14, lineHeight: 1.6 }}>Kirim foto via WA. Revisi sampai H-hari.</p>
            <a href="https://wa.me/6281234567890?text=Halo%20mstory,%20mau%20dibuatkan%20undangan" target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: "#fff", color: "#111", borderRadius: 999, padding: "12px", marginTop: 14, textDecoration: "none", fontWeight: 600 }}>Konsultasi WA Gratis</a>
          </div>
        </div>
      </section>
    </div>
  );
}
const cta: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "12px 20px", borderRadius: 999, background: "#111", color: "#fff", textDecoration: "none", fontWeight: 600 };
