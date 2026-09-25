import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";
import { Readable } from "stream";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
const ROOT_FOLDER = process.env.GOOGLE_DRIVE_FOLDER_ID;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing Supabase env");
  process.exit(1);
}
const supa = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const DEMOS = [
  { slug: "noir-eternel", title: "Noir Éternel — Weding Demo", couple: ["Adrian Noir", "Élise"], tier: "gold" },
  { slug: "ivory-garden", title: "Ivory Garden — Wedding Demo", couple: ["Andi", "Sari"], tier: "gold" },
  { slug: "celestial-vow", title: "Celestial Vow — Wedding Demo", couple: ["Reza", "Dewi"], tier: "gold" },
  { slug: "lumiere", title: "Lumière — Wedding Demo", couple: ["Bagas", "Maya"], tier: "platinum" },
  { slug: "heritage-silk", title: "Heritage Silk — Wedding Demo", couple: ["Fajar", "Lestari"], tier: "gold" },
  { slug: "serene-arch", title: "Serene Arch — Wedding Demo", couple: ["Gilang", "Rani"], tier: "silver" },
  { slug: "blush-bloom", title: "Blush Bloom — Wedding Demo", couple: ["Hendra", "Nabila"], tier: "silver" },
  { slug: "modern-minimal", title: "Modern Minimal — Wedding Demo", couple: ["Kevin", "Clara"], tier: "bronze" },
  { slug: "classic-ivory", title: "Classic Ivory — Wedding Demo", couple: ["Raka", "Intan"], tier: "bronze" },
  { slug: "midnight-rose", title: "Midnight Rose — Wedding Demo", couple: ["Dimas", "Kirana"], tier: "gold" },
  { slug: "sage-ritual", title: "Sage Ritual — Wedding Demo", couple: ["Bayu", "Ayu"], tier: "silver" },
  { slug: "velvet-noon", title: "Velvet Noon — Wedding Demo", couple: ["Rafi", "Zahra"], tier: "silver" },
  { slug: "adagio", title: "Adagio — Wedding Demo", couple: ["Niko", "Felicia"], tier: "gold" },
  { slug: "solenne", title: "Solenne — Wedding Demo", couple: ["Aldo", "Marsha"], tier: "gold" },
  { slug: "amandine", title: "Amandine — Wedding Demo", couple: ["Ken", "Aurora"], tier: "bronze" },
  { slug: "adat-jawa-ageng", title: "Jawa Ageng — Adat Demo", couple: ["Joko", "Ratih"], tier: "gold" },
  { slug: "adat-sunda-kencana", title: "Sunda Kencana — Adat Demo", couple: ["Asep", "Sinta"], tier: "gold" },
  { slug: "adat-minang-balairung", title: "Minang Balairung — Adat Demo", couple: ["Fahri", "Putri"], tier: "gold" },
  { slug: "adat-batak-gorga", title: "Batak Gorga — Adat Demo", couple: ["Togar", "Mery"], tier: "gold" },
  { slug: "adat-bali-prasada", title: "Bali Prasada — Adat Demo", couple: ["Gede", "Kadek"], tier: "gold" },
  { slug: "adat-melayu-seri", title: "Melayu Seri — Adat Demo", couple: ["Rizal", "Mira"], tier: "gold" },
  { slug: "adat-betawi-sophi", title: "Betawi Sophi — Adat Demo", couple: ["Udin", "Lilis"], tier: "gold" },
  { slug: "adat-jawa-prameswari", title: "Jawa Prameswari — Adat Demo", couple: ["Budi", "Wulan"], tier: "platinum" },
  { slug: "animasi-lune", title: "Animasi Lune — Demo", couple: ["Luna", "Arga"], tier: "gold" },
  { slug: "animasi-aurelia", title: "Animasi Aurelia — Demo", couple: ["Aurelia", "Neo"], tier: "gold" },
  { slug: "animasi-etincelle", title: "Animasi Étincelle — Demo", couple: ["Etien", "Chella"], tier: "gold" },
  { slug: "animasi-velour", title: "Animasi Velour — Demo", couple: ["Velin", "Raka"], tier: "gold" },
  { slug: "animasi-rivage", title: "Animasi Rivage — Demo", couple: ["Riva", "Genta"], tier: "gold" },
  { slug: "animasi-nocturne", title: "Animasi Nocturne — Demo", couple: ["Noctua", "Luna"], tier: "gold" },
  { slug: "khitan-arslan-elegant", title: "Khitan Arslan — Demo", couple: ["Arslan", "Ayah: Pak Hadi"], tier: "silver" },
  { slug: "khitan-safir", title: "Khitan Safir — Demo", couple: ["Safir", "Ayah: Pak Budi"], tier: "silver" },
  { slug: "khitan-amir", title: "Khitan Amir — Demo", couple: ["Amir", "Ayah: Pak Joni"], tier: "silver" },
  { slug: "aqiqah-noura", title: "Aqiqah Noura — Demo", couple: ["Noura", "Ayah Bunda: Rina & Andi"], tier: "silver" },
  { slug: "aqiqah-izzah", title: "Aqiqah Izzah — Demo", couple: ["Izzah", "Ayah Bunda: Sari & Budi"], tier: "silver" },
  { slug: "aqiqah-zayyan", title: "Aqiqah Zayyan — Demo", couple: ["Zayyan", "Ayah Bunda: Lina & Fajar"], tier: "silver" },
  { slug: "birthday-liora", title: "Birthday Liora — Demo", couple: ["Liora", "Usia 5"], tier: "bronze" },
  { slug: "birthday-elio", title: "Birthday Elio — Demo", couple: ["Elio", "Usia 7"], tier: "bronze" },
  { slug: "tasmiyah-elegant", title: "Tasmiyah Elegant — Demo", couple: ["Tasmiyah Zahra", "Ayah Bunda"], tier: "silver" },
  { slug: "tedak-siten-prameswari", title: "Tedak Siten — Demo", couple: ["Gendis", "Ayah Bunda"], tier: "silver" },
  { slug: "engagement-eternel", title: "Engagement Éternel — Demo", couple: ["Raka", "Noura"], tier: "gold" },
  { slug: "eclat-noir", title: "Éclat Noir — Wedding Demo", couple: ["Noir", "Eclat"], tier: "gold" },
  { slug: "vermeil", title: "Vermeil — Wedding Demo", couple: ["Vermeil", "Rose"], tier: "gold" },
  { slug: "moire-sable", title: "Moiré Sable — Wedding Demo", couple: ["Sable", "Moir"], tier: "silver" },
  { slug: "orangerie", title: "Orangerie — Wedding Demo", couple: ["Orange", "Citrus"], tier: "gold" },
  { slug: "pembayun-elegant", title: "Pembayun Elegant — Adat Demo", couple: ["Pembayun", "Kraton"], tier: "gold" },
  { slug: "sangkala", title: "Sangkala — Adat Demo", couple: ["Sangkala", "Prasi"], tier: "gold" },
  { slug: "animasi-celestine", title: "Animasi Célestine — Demo", couple: ["Celestine", "Aurora"], tier: "gold" },
  { slug: "walimatul-khitan-elite", title: "Walimatul Khitan Elite — Demo", couple: ["Elite Khitan", "Ayah Bunda"], tier: "gold" },
  { slug: "aqiqah-hana-prameswari", title: "Aqiqah Hana — Demo", couple: ["Hana", "Ayah Bunda"], tier: "silver" },
  { slug: "ultah-aria", title: "Ultah Aria — Demo", couple: ["Aria", "Usia 8"], tier: "bronze" },
];

function demoData(slug, title, couple) {
  const isNonWedding = slug.startsWith("khitan") || slug.startsWith("aqiqah") || slug.startsWith("birthday") || slug.startsWith("tasmiyah") || slug.startsWith("tedak") || slug.startsWith("ultah") || slug.startsWith("walimatul");
  if (isNonWedding) {
    return {
      quote: "Semoga menjadi anak yang sholeh/sholehah, berbakti kepada orang tua, agama, dan bangsa.",
      quoteSource: "Doa orang tua",
      couple: {
        groom: { name: couple[0], fullName: couple[0], parents: couple[1] ?? "" },
        bride: { name: couple[1] ?? "", fullName: couple[1] ?? "", parents: "" },
      },
      events: [
        { title: "Tasyakuran", date: "2026-12-20", time: "09:00", venue: "Kediaman Bapak/Ibu", address: "Jl. Kebahagiaan No. 12, Bandung", mapsUrl: "https://maps.google.com/?q=Bandung" },
      ],
      banks: [{ bank: "BCA", number: "1234567890", name: "Ayah Bunda" }],
      giftAddress: { name: "Ayah Bunda", phone: "081234567890", address: "Jl. Kebahagiaan 12" },
      musicUrl: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_7a9e3e3c54.mp3",
    };
  }
  const isAdat = slug.startsWith("adat") || slug.startsWith("pembayun") || slug.startsWith("sangkala");
  return {
    quote: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri.",
    quoteSource: "Q.S. Ar-Rum: 21",
    couple: {
      groom: { name: couple[0], fullName: `${couple[0]} Putra`, parents: "Putra dari Bapak & Ibu" },
      bride: { name: couple[1], fullName: `${couple[1]} Putri`, parents: "Putri dari Bapak & Ibu" },
    },
    events: [
      { title: "Akad Nikah", date: "2026-12-20", time: "08:00", venue: "Masjid Al-Ikhlas", address: "Jl. Kebahagiaan No. 12, Bandung", mapsUrl: "https://maps.google.com/?q=Bandung" },
      { title: "Resepsi", date: "2026-12-20", time: "11:00", venue: "Gedung Puri Asri", address: "Jl. Kebahagiaan No. 12, Bandung", mapsUrl: "https://maps.google.com/?q=Bandung" },
    ],
    banks: [
      { bank: "BRI", number: "1234567890", name: couple[0] },
      { bank: "DANA", number: "081234567890", name: couple[1] },
    ],
    giftAddress: { name: couple[0], phone: "081234567890", address: "Bandung" },
    musicUrl: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_7a9e3e3c54.mp3",
    liveStreamUrl: "",
    // adat flavour
    ...(isAdat ? { adatTheme: slug } : {}),
  };
}

async function getDrive() {
  if (!REFRESH_TOKEN || !GOOGLE_CLIENT_ID) return null;
  const oauth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
  oauth.setCredentials({ refresh_token: REFRESH_TOKEN });
  try {
    await oauth.getAccessToken();
  } catch (e) {
    console.warn("GDrive auth failed, skip gallery:", e.message);
    return null;
  }
  return google.drive({ version: "v3", auth: oauth });
}

async function ensureFolder(drive, name, parentId) {
  const q = [`name = '${name.replace(/'/g, "\\'")}'`, "mimeType = 'application/vnd.google-apps.folder'", "trashed = false", parentId ? `'${parentId}' in parents` : undefined].filter(Boolean).join(" and ");
  const found = await drive.files.list({ q, fields: "files(id,name)", pageSize: 1 });
  if (found.data.files?.[0]?.id) return found.data.files[0].id;
  const created = await drive.files.create({ requestBody: { name, mimeType: "application/vnd.google-apps.folder", parents: parentId ? [parentId] : undefined }, fields: "id" });
  return created.data.id;
}

async function uploadImageUrl(drive, url, filename, folderId) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const driveRes = await drive.files.create({
    requestBody: { name: filename, parents: [folderId] },
    media: { mimeType: res.headers.get("content-type") || "image/jpeg", body: Readable.from(buf) },
    fields: "id,name,webViewLink",
  });
  await drive.permissions.create({ fileId: driveRes.data.id, requestBody: { role: "reader", type: "anyone" } }).catch(() => {});
  return { id: driveRes.data.id, url: `https://drive.google.com/uc?export=view&id=${driveRes.data.id}` };
}

const GALLERY_SEEDS = {
  wedding: ["https://picsum.photos/seed/wedding1/800/600", "https://picsum.photos/seed/wedding2/800/600", "https://picsum.photos/seed/wedding3/800/600", "https://picsum.photos/seed/wedding4/800/600"],
  adat: ["https://picsum.photos/seed/adat1/800/600", "https://picsum.photos/seed/adat2/800/600", "https://picsum.photos/seed/adat3/800/600", "https://picsum.photos/seed/adat4/800/600"],
  animasi: ["https://picsum.photos/seed/animasi1/800/600", "https://picsum.photos/seed/animasi2/800/600", "https://picsum.photos/seed/animasi3/800/600"],
  "non-wedding": ["https://picsum.photos/seed/khitan1/800/600", "https://picsum.photos/seed/khitan2/800/600", "https://picsum.photos/seed/baby1/800/600"],
};

async function main() {
  const { data: profiles } = await supa.from("profiles").select("id").limit(1);
  let demoUserId = profiles?.[0]?.id;
  if (!demoUserId) {
    const { data: u } = await supa.auth.admin.listUsers();
    demoUserId = u?.users?.[0]?.id;
  }
  if (!demoUserId) {
    console.error("No user for demo owner. Buat 1 akun dulu di /register.");
    process.exit(1);
  }
  console.log("Demo owner:", demoUserId);

  const drive = await getDrive();
  if (drive) console.log("GDrive ready, root:", ROOT_FOLDER || "(My Drive)");
  else console.log("GDrive skip (no token) — gallery pakai URL langsung");

  for (const d of DEMOS) {
    const { data: tmpl } = await supa.from("templates").select("id,category").eq("slug", d.slug).maybeSingle();
    if (!tmpl) {
      console.warn(`Template ${d.slug} not found, skip`);
      continue;
    }
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    const payload = {
      user_id: demoUserId,
      template_id: tmpl.id,
      slug: d.slug,
      title: d.title,
      status: "published",
      tier: d.tier,
      expired_at: expiry.toISOString(),
      data: demoData(d.slug, d.title, d.couple),
      view_count: 0,
    };
    const { data: existing } = await supa.from("invitations").select("id").eq("slug", d.slug).maybeSingle();
    let invId;
    if (existing) {
      await supa.from("invitations").update(payload).eq("id", existing.id);
      invId = existing.id;
      console.log(`Updated demo ${d.slug}`);
    } else {
      const { data: inv, error } = await supa.from("invitations").insert(payload).select("id").single();
      if (error) {
        console.error(`Insert ${d.slug} fail`, error.message);
        continue;
      }
      invId = inv.id;
      console.log(`Created demo ${d.slug}`);
    }

    const urls = GALLERY_SEEDS[tmpl.category] || GALLERY_SEEDS.wedding;
    for (let i = 0; i < Math.min(urls.length, 4); i++) {
      const galleryUrl = urls[i];
      let driveFileId = null;
      let finalUrl = galleryUrl;
      if (drive) {
        try {
          const folderId = await ensureFolder(drive, `mstory-${d.slug}`, ROOT_FOLDER || undefined);
          const up = await uploadImageUrl(drive, galleryUrl, `${d.slug}-${i + 1}.jpg`, folderId);
          driveFileId = up.id;
          finalUrl = up.url;
        } catch (e) {
          console.warn(`GDrive upload ${d.slug} #${i} fail:`, e.message);
        }
      }
      const { data: has } = await supa.from("gallery_items").select("id").eq("invitation_id", invId).eq("url", finalUrl).maybeSingle();
      if (!has) {
        await supa.from("gallery_items").insert({ invitation_id: invId, type: "photo", url: finalUrl, r2_key: null, drive_file_id: driveFileId, sort_order: i });
      }
    }

    const wishes = [
      { guest_name: "Yoga", message: "Selamat menempuh hidup baru!", rsvp_status: "hadir" },
      { guest_name: "Keluarga Besar", message: "Semoga sakinah mawaddah warahmah.", rsvp_status: "hadir" },
    ];
    for (const w of wishes) {
      await supa.from("wishes").insert({ invitation_id: invId, ...w }).then(() => {}).catch(() => {});
    }
  }
  console.log("Done 50 demos. Check /<slug> e.g. /noir-eternel");
}

main().catch((e) => { console.error(e); process.exit(1); });
