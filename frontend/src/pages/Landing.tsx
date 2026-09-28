import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API } from "../lib/api";
import { CATALOG, thumbFor, type Cat } from "../lib/catalog";
const CATS: { id: Cat; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "wedding", label: "Wedding" },
  { id: "adat", label: "Adat" },
  { id: "animasi", label: "Animasi" },
  { id: "non-wedding", label: "Non Wedding" },
];
export default function Landing() {
  const [sp] = useSearchParams();
  const cat = (sp.get("cat") as Cat) ?? "all";
  const [q, setQ] = useState("");
  const [serverItems, setServerItems] = useState<{ slug: string; thumbnail_url?: string | null }[] | null>(null);
  useEffect(() => {
    fetch(`${API}/api/templates${cat === "all" ? "" : `?cat=${cat}`}`).then((r) => r.json()).then((d) => { if (Array.isArray(d)) setServerItems(d); }).catch(() => {});
  }, [cat]);
  const base = CATALOG.filter((x) => cat === "all" || x.cat === cat);
  const filtered = q.trim() ? base.filter((x) => x.title.toLowerCase().includes(q.toLowerCase()) || x.slug.includes(q.toLowerCase())) : base;
  const thumbMap = new Map((serverItems ?? []).map((s) => [s.slug, s.thumbnail_url]));
  return (
    <div style={{ fontFamily: "Outfit,system-ui,sans-serif", color: "#14141a", background: "#f8f7f4", minHeight: "100svh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@400;500;600&display=swap');`}</style>
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/logo.svg" alt="mstory.id" style={{ height: 36, width: "auto" }} />
            <span style={{ fontSize: 9, background: "#111", color: "#fff", borderRadius: 999, padding: "4px 8px", letterSpacing: ".12em", fontWeight: 600 }}>KATALOG 60</span>
          </Link>
          <nav style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Link to="/pesan" style={{ fontSize: 13, color: "#1c3147", textDecoration: "none", border: "1px solid #c4a574", padding: "8px 12px", borderRadius: 999, fontWeight: 600 }}>Form Pesan</Link>
            <a href="https://wa.me/6281234567890?text=Halo%20mstory,%20mau%20tanya%20katalog" target="_blank" rel="noreferrer" style={{ background: "#111", color: "#fff", borderRadius: 999, padding: "8px 14px", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>Chat WA</a>
            <Link to="/login" style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>Admin</Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 16px 40px" }}>
        <div style={{ background: "#fff", border: "1px solid #ebe8e3", borderRadius: 16, padding: "16px 16px 12px" }}>
          <p style={{ fontSize: 11, letterSpacing: ".18em", color: "#c4a574", margin: 0, fontWeight: 700 }}>KATALOG — PILIHAN TEMA</p>
          <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(28px,4vw,36px)", margin: "6px 0 4px", color: "#1c3147" }}>Click to see design — 60 Tema</h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}>Untuk warna asli buka link undangan di browser mode terang (bukan dark mode). Tap kartu HP di bawah untuk lihat contoh, lalu Pesan Tema.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            {CATS.map((c) => (
              <Link key={c.id} to={c.id === "all" ? "/" : `/?cat=${c.id}`} style={{ padding: "7px 12px", borderRadius: 999, border: cat === c.id ? "1px solid #c4a574" : "1px solid #e8e8e8", background: cat === c.id ? "#fff7ed" : "#fff", color: cat === c.id ? "#1c3147" : "#6b7280", textDecoration: "none", fontSize: 13, fontWeight: cat === c.id ? 700 : 400 }}>{c.label}</Link>
            ))}
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari tema (mis. jawa, noir, khitan)..." style={{ marginTop: 12, width: "100%", maxWidth: 420, padding: "10px 12px", borderRadius: 999, border: "1px solid #ddd", fontSize: 13 }} />
          <p style={{ margin: "10px 0 0", fontSize: 12, color: "#9aa" }}>{filtered.length} tema · Harga by WA — klik Pesan setelah pilih tema</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 14, marginTop: 16 }}>
          {filtered.map((t) => {
            const thumb = thumbMap.get(t.slug) || thumbFor(t.slug);
            return (
              <article key={t.slug} style={{ background: "#fff", border: "1px solid #ebe8e3", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: 10, background: "#0f172a", display: "grid", placeItems: "center" }}>
                  <div style={{ width: "100%", maxWidth: 160, background: "#fff", borderRadius: 18, padding: 6, boxShadow: "0 8px 24px rgba(0,0,0,.25)" }}>
                    <div style={{ height: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 4 }}>
                      <span style={{ width: 28, height: 4, borderRadius: 999, background: "#111" }} /><span style={{ width: 6, height: 6, borderRadius: 999, background: "#ddd" }} />
                    </div>
                    <img src={thumb} alt={t.title} loading="lazy" style={{ width: "100%", aspectRatio: "9/16", objectFit: "cover", borderRadius: 12, display: "block", background: "#f4f1ea" }} />
                  </div>
                </div>
                <div style={{ padding: "10px 10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 10, letterSpacing: ".14em", color: "#c4a574", textTransform: "uppercase", fontWeight: 700 }}>{t.cat}</span>
                  <h3 style={{ margin: 0, fontSize: 14, color: "#1c3147", lineHeight: 1.2 }}>{t.title}</h3>
                  <p style={{ margin: 0, fontSize: 11, color: "#8a929a" }}>{t.slug}</p>
                  <div style={{ display: "grid", gap: 6, marginTop: "auto", paddingTop: 8 }}>
                    <Link to={`/${t.slug}?to=Tamu%20Undangan`} style={{ textAlign: "center", background: "#fff", color: "#1c3147", border: "1px solid #c4a574", padding: "8px", borderRadius: 999, textDecoration: "none", fontSize: 12, fontWeight: 600 }}>Lihat Contoh</Link>
                    <Link to={`/pesan?tema=${t.slug}`} style={{ textAlign: "center", background: "#1c3147", color: "#fff", padding: "9px", borderRadius: 999, textDecoration: "none", fontSize: 12, fontWeight: 700 }}>Pesan Tema Ini</Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div style={{ marginTop: 22, background: "#1c3147", color: "#f7f1e6", borderRadius: 16, padding: 18, display: "grid", gap: 10 }}>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: ".14em", opacity: .8 }}>CATATAN PENGISIAN FORM</p>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, opacity: .9 }}>Foto via WhatsApp/Google Drive setelah pesan. Isi nama awal mempelai (Pria/Wanita), Muslim/Non-Muslim, data lengkap acara Akad & Resepsi + maps, 14 foto album + 2 foto/mempelai + video bila ada, musik, angpao 2 rekening, alamat kado, link live, RSVP 1 WA, Story of Love. Tanda ❌ untuk yang tidak diisi. Harga by WA.</p>
          <Link to="/pesan" style={{ display: "inline-block", background: "#fff", color: "#1c3147", padding: "10px 16px", borderRadius: 999, textDecoration: "none", fontWeight: 700, width: "fit-content" }}>Buka Form Pemesanan →</Link>
        </div>
      </main>
    </div>
  );
}
