-- Ubah expiry H+10 -> H+3 permanen
-- Jalankan di Supabase SQL Editor

-- 1. Update semua invitation yang expired_at-nya masih H+10 dari event
update public.invitations set expired_at = (
  select ((elem->>'date')::date + interval '3 days' + time '23:59:59')::timestamptz
  from jsonb_array_elements(case when data ? 'events' then data->'events' else '[]'::jsonb end) elem
  where elem->>'date' is not null and elem->>'date' <> ''
  order by elem->>'date' asc limit 1
) where expired_at is not null and status in ('published','draft') and data ? 'events';

-- 2. Jika ada invitation published tanpa expired_at tapi punya event date, set H+3
update public.invitations set expired_at = (
  select ((elem->>'date')::date + interval '3 days' + time '23:59:59')::timestamptz
  from jsonb_array_elements(case when data ? 'events' then data->'events' else '[]'::jsonb end) elem
  where elem->>'date' is not null and elem->>'date' <> ''
  order by elem->>'date' asc limit 1
) where expired_at is null and data ? 'events';

-- Verifikasi
select id, slug, expired_at, data->'events'->0->>'date' as event_date from public.invitations order by expired_at desc nulls last limit 10;
