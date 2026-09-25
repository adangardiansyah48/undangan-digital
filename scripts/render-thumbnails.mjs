import { createClient } from "@supabase/supabase-js";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function main() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://mstory.adangardiansyah48.workers.dev";
  const { data: templates } = await supa.from("templates").select("slug,thumbnail_url,title,category").order("sort_order");
  console.log(`Rendering ${templates.length} thumbnails…`);

  const outDir = "public/thumbnails";
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

  let done = 0;
  for (const t of templates) {
    const slug = t.slug;
    const url = `${base}/${slug}`;
    const thumbUrl = t.thumbnail_url;

    if (thumbUrl && thumbUrl.includes("drive.google.com/thumbnail")) {
      try {
        const r = await fetch(thumbUrl);
        if (r.ok) {
          const buf = Buffer.from(await r.arrayBuffer());
          const ext = "jpg";
          await writeFile(`${outDir}/${slug}.jpg`, buf);
          await supa.from("templates").update({ thumbnail_url: `/thumbnails/${slug}.jpg` }).eq("slug", slug);
          done++;
          console.log(`[${done}/${templates.length}] ${slug} → /thumbnails/${slug}.jpg (${buf.length} bytes)`);
          continue;
        }
      } catch (e) { console.warn(slug, e.message); }
    }

    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='hsl(${(hash(slug)%360)} 55% 88%)'/><stop offset='100%' stop-color='hsl(${((hash(slug)+30)%360)} 50% 92%)'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='42%' text-anchor='middle' font-family='serif' font-size='18' fill='#444'>${t.category.toUpperCase()}</text><text x='50%' y='50%' text-anchor='middle' font-family='sans-serif' font-size='20' font-weight='700' fill='#222'>${t.title}</text><text x='50%' y='58%' text-anchor='middle' font-family='sans-serif' font-size='12' fill='#666'>${slug}</text><text x='50%' y='96%' text-anchor='middle' font-family='sans-serif' font-size='10' fill='#999'>${url}</text></svg>`;
    await writeFile(`${outDir}/${slug}.svg`, svg);
    await supa.from("templates").update({ thumbnail_url: `/thumbnails/${slug}.svg` }).eq("slug", slug);
    done++;
    console.log(`[${done}/${templates.length}] ${slug} → SVG fallback`);
  }
  console.log(`Done ${done}/${templates.length}. Next: commit + deploy, public/thumbnails served via ASSETS`);
}

function hash(s){ let n=0; for(let i=0;i<s.length;i++) n=(n*31+s.charCodeAt(i))>>>0; return n; }
main().catch(e=>{ console.error(e); process.exit(1); });
