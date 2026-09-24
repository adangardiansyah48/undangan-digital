# Invora — Undangan Digital Hybrid

Next.js + Supabase + Google Drive OAuth + Vercel. Bikin sendiri atau dibuatkan tim.

## Quick start (tanpa env pun jalan)

```bash
cd D:/undangan_digital/undangan-digital
npm i
npm run dev
# http://localhost:3000
```

Halaman `/dashboard/new` & `/dashboard/invitations` akan error message tapi app tetap jalan.
Atur env untuk fitur penuh.

## Env (.env.local)

Salin dari `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WA_NUMBER=6281234567890
GOOGLE_CLIENT_ID=... (optional, untuk GDrive)
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/gdrive/callback
```

## Setup Supabase

1. Buat project di supabase.com
2. SQL Editor → paste `supabase/schema.sql` → Run (profiles, templates, invitations, guests, wishes, orders, assistance_requests, gallery_items, analytics, gdrive_tokens + RLS + seed 13 template)
3. Auth → Providers → aktifkan Email + Google (redirect `http://localhost:3000/auth/callback`)
4. Isi keys ke `.env.local` → restart `npm run dev`

## Google Drive (optional, storage besar)

1. Google Cloud Console → OAuth consent + buat OAuth 2.0 Client ID (Web)
2. Authorized redirect URI: `http://localhost:3000/api/auth/gdrive/callback` dan `https://domain-prod/api/auth/gdrive/callback`
3. Isi GOOGLE_* di `.env.local` → login → Dashboard Settings → Hubungkan Google Drive → galeri unggah pakai folder `Invora/{slug}` dan jadi shareable

## Deploy Vercel + GitHub

```bash
git init
git add .
git commit -m "feat: invora mvp"
gh repo create invora --public --source=. --push
# Vercel → Import GitHub repo → env vars sama → Deploy
```

`middleware.ts` guard `/dashboard` & `/admin` (butuh Supabase configured).

## Alur hybrid

- **Self**: katalog → daftar → /dashboard/new (Self) → editor (mempelai/acara/galeri/tamu/amplop) → publish → sebar `/{slug}?to=Nama`
- **Assisted**: /dashboard/new (Dibuatkan tim + brief) → order pending → admin kerjakan → preview → publish

Public: `/{slug}?to=Yoga+Riza` — cover personal → Buka → countdown/maps/gift/wish. View count + analytics tercatat.
