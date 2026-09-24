# Invora — Undangan Digital Hybrid (full Cloudflare)

**Stack gratis:** Cloudflare Workers (Hono API) + Cloudflare Pages (Vite React) + Supabase PostgreSQL + Google Drive OAuth. Tanpa Render/Vercel.

## Struktur

- `backend/` — Hono Worker (`src/worker.ts` + Express compat `src/server.ts`) → deploy `npx wrangler deploy` (Workers).
- `frontend/` — Vite React → Cloudflare Pages (root `frontend`, build `npm run build`, output `dist`).
- `supabase/schema.sql` — 10 tabel + RLS + seed 13 template.
- Root Next.js (`src/`, `package.json`) — legacy dev, tetap `npm run dev` / `npm run build`.

## Local dev

```bash
# backend Worker (port 4000) — butuh .env via wrangler vars/secrets atau backend/.env untuk Express
npm --prefix backend run dev:worker
# atau Express legacy
npm --prefix backend run dev

# frontend
npm --prefix frontend run dev
# http://localhost:5173  (proxy /api → :4000 jika pakai Express; Workers via VITE_API_URL)

# Next legacy
npm run dev            # http://localhost:3000
npm run build -- --webpack
```

## Env

- `backend/.env.example` → copy ke `backend/.env` (Express) dan `npx wrangler secret put ...` untuk Workers: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` (Workers: `https://<worker>.workers.dev/api/auth/gdrive/callback`), `GOOGLE_DRIVE_FOLDER_ID`, `FRONTEND_URL`.
- `frontend/.env.example` → `frontend/.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL` (Workers URL).
- `.env.local.example` → `.env.local` (Next legacy).

Semua `.env` di `.gitignore`.

## Deploy Cloudflare

1. Workers: `cd backend && npx wrangler login && npx wrangler deploy` — set `vars` di `wrangler.toml` (`FRONTEND_URL`) + `wrangler secret put SUPABASE_URL` dst.
2. Pages: dash.cloudflare.com → Pages → Create → Connect GitHub `adangardiansyah48/undangan-digital` → Project `frontend` → Build `npm run build` (root `frontend`, output `dist`) → Env `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`.
3. Google Cloud Console → OAuth redirect → tambah `https://<worker>.workers.dev/api/auth/gdrive/callback` + dev URIs.

## Alur hybrid

- **Self**: katalog → daftar → /dashboard/new (Self) → editor → publish → sebar `/{slug}?to=Nama`
- **Assisted**: /dashboard/new (Dibuatkan tim + brief) → order pending → admin preview → publish

Public: `/{slug}?to=Yoga` — cover → countdown/maps/gift/wish. View+analytics tercatat.
