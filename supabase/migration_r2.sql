-- R2 storage — jalankan di Supabase SQL Editor jika DB sudah ada
alter table public.gallery_items add column if not exists r2_key text;
create index if not exists idx_gallery_r2key on public.gallery_items(r2_key);
create index if not exists idx_invitations_expired on public.invitations(expired_at) where expired_at is not null;

-- Backfill expiry = event date + 10 hari untuk invitation yang belum punya expired_at
update public.invitations set expired_at = (
  select ( (elem->>'date')::date + interval '10 days' + time '23:59:59')::timestamptz
  from jsonb_array_elements(case when data ? 'events' then data->'events' else '[]'::jsonb end) elem
  where elem->>'date' is not null and elem->>'date' <> ''
  order by elem->>'date' asc limit 1
) where expired_at is null and status = 'published' and data ? 'events';

-- Set gdrive_tokens optional (sudah tidak wajib)
-- Tidak ada perubahan RLS — katalog/templates tidak tersentuh cleanup
