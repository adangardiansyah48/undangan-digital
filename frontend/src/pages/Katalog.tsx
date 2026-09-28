import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API } from "../lib/api";
type T = { slug: string; category: string; title: string; description: string; is_premium: boolean; thumbnail_url?: string | null };
const FALLBACK: T[] = [
  { slug: "demo41", category: "adat", title: "Vony & Kay — Adat Jawa Navy", description: "Demo 41 · kebaya navy bordir, beskap batik cokelat-emas. Musik, gallery klik, staggered 1.6s.", is_premium: true, thumbnail_url: "/demo41/cover.jpg" },
  { slug: "elegant-ivory", category: "wedding", title: "Elegant Ivory", description: "Putih gading + gold, foto bulat couple.", is_premium: false, thumbnail_url: "/demo41/g2.jpg" },
  { slug: "sunda-siger", category: "adat", title: "Sunda Siger", description: "Sunda elegan, palette dusty teal.", is_premium: true, thumbnail_url: "/demo41/g3.jpg" },
  { slug: "minimal-anim", category: "animasi", title: "Minimal Anim", description: "Animasi smooth ken burns.", is_premium: false, thumbnail_url: "/demo41/g7.jpg" },
  { slug: "aqiqah-pastel", category: "non-wedding", title: "Aqiqah Pastel", description: "Non-wedding pastel.", is_premium: false, thumbnail_url: "/demo41/g5.jpg" },
];
export default function Katalog() {
  const [sp] = useSearchParams();
  const cat = sp.get("cat") ?? "all";
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => {
    fetch(`${API}/api/templates${cat === "all" ? "" : `?cat=${cat}`}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: T[]) => { if (Array.isArray(d) && d.length) setItems(d); else setItems(FALLBACK.filter((x) => cat === "all" || x.category === cat)); })
      .catch(() => setItems(FALLBACK.filter((x) => cat === "all" || x.category === cat)));
  }, [cat]);
  const list = items.length ? items : FALLBACK.filter((x) => cat === "all" || x.category === cat);
  const featured = FALLBACK[0];
  const grid = list.filter((x) => x.slug !== "demo41");
  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto", fontFamily: "Outfit,system-ui,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Outfit:wght@400;500&display=swap');`}</style>
      <h1 style={{ fontFamily: "Cormorant Garamond,serif", color: "#1c3147", margin: 0 }}>Katalog</h1>
      <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {["all", "wedding", "adat", "animasi", "non-wedding"].map((c) => (
          <Link key={c} to={c === "all" ? "/katalog" : `/katalog?cat=${c}`} style={{ fontWeight: cat === c ? 700 : 400, color: "#1c3147", textDecoration: "none", border: cat === c ? "1px solid #c4a574" : "1px solid transparent", padding: "6px 10px", borderRadius: 999 }}>
            {c}
          </Link>
        ))}
      </nav>
      <Link to="/example?to=Tamu%20Undangan" style={{ textDecoration: "none", color: "inherit", display: "block", marginTop: 20, border: "1px solid #c4a57455", borderRadius: 16, overflow: "hidden", boxShadow: "0 12px 32px #1c31470f", background: "#fff" }}>
        <img src={featured.thumbnail_url ?? "/demo41/cover.jpg"} alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
        <div style={{ padding: 16 }}>
          <span style={{ fontSize: 11, letterSpacing: ".18em", color: "#c4a574", textTransform: "uppercase" }}>No.1 · {featured.category} — Featured</span>
          <h2 style={{ margin: "6px 0 4px", color: "#1c3147" }}>{featured.title}</h2>
          <p style={{ margin: 0, color: "#5a6570", fontSize: 13 }}>{featured.description}</p>
          <span style={{ display: "inline-block", marginTop: 12, background: "#c4a574", color: "#fff", padding: "9px 16px", borderRadius: 999, fontSize: 13 }}>Lihat Demo → /example</span>
        </div>
      </Link>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16, marginTop: 20 }}>
        {grid.map((t) => (
          <div key={t.slug} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, background: "#fff" }}>
            {t.thumbnail_url && <img src={t.thumbnail_url} alt="" style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />}
            <strong style={{ color: "#1c3147" }}>{t.title}</strong> <small style={{ color: "#5a6570" }}>{t.category} {t.is_premium ? "· Premium" : ""}</small>
            <p style={{ opacity: 0.7, fontSize: 13, margin: "6px 0 10px" }}>{t.description}</p>
            {t.slug === "demo41" ? <Link to="/example?to=Tamu%20Undangan">Lihat Demo</Link> : <Link to={`/preview/${t.slug}`}>Preview</Link>} {" · "} <Link to={`/dashboard/new?template=${t.slug}&track=self`}>Self</Link> {" · "} <Link to={`/dashboard/new?template=${t.slug}&track=assisted`}>Assisted</Link>
          </div>
        ))}
        {cat === "wedding" && grid.filter((x) => x.category === "wedding").length === 0 && (
          <div style={{ border: "1px dashed #c4a57488", borderRadius: 12, padding: 16, background: "#fffdf6", display: "grid", placeItems: "center", minHeight: 160, textAlign: "center" }}>
            <div>
              <p style={{ margin: 0, color: "#1c3147", fontWeight: 600 }}>Wedding — Demo 41</p>
              <p style={{ margin: "6px 0 10px", color: "#5a6570", fontSize: 13 }}>Belum ada template wedding dari API · lihat Demo 41 di atas</p>
              <Link to="/example?to=Tamu%20Undangan" style={{ color: "#c4a574" }}>Buka /example →</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
