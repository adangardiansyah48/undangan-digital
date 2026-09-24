import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API } from "../lib/api";

type T = { slug:string; category:string; title:string; description:string; is_premium:boolean };
export default function Katalog() {
  const [sp] = useSearchParams();
  const cat = sp.get("cat") ?? "all";
  const [items, setItems] = useState<T[]>([]);
  useEffect(()=>{ fetch(`${API}/api/templates${cat==="all"?"":`?cat=${cat}`}`).then(r=>r.json()).then(setItems).catch(()=>setItems([])); }, [cat]);
  return (
    <main style={{ padding:24, maxWidth:1100, margin:"0 auto" }}>
      <h1>Katalog</h1>
      <nav style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {["all","wedding","adat","animasi","non-wedding"].map(c=> <Link key={c} to={c==="all"?"/katalog":`/katalog?cat=${c}`} style={{fontWeight: cat===c?700:400}}>{c}</Link>)}
      </nav>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16,marginTop:24}}>
        {items.map(t=> <div key={t.slug} style={{border:"1px solid #ddd",borderRadius:12,padding:16}}>
          <strong>{t.title}</strong> <small>{t.category} {t.is_premium?"· Premium":""}</small>
          <p style={{opacity:0.7}}>{t.description}</p>
          <Link to={`/preview/${t.slug}`}>Preview</Link> {" · "} <Link to={`/dashboard/new?template=${t.slug}`}>Pakai</Link>
        </div>)}
      </div>
      {!items.length && <p>Memuat… atau backend belum jalan.</p>}
    </main>
  );
}
