-- Guest order (toko undangan) — tanpa login. GDrive via service refresh_token global.
create table if not exists public.guest_orders (
  id uuid primary key default gen_random_uuid(),
  template_slug text not null references public.templates(slug) on delete restrict,
  status text not null default 'pending' check (status in ('pending','paid','in_progress','review','done','rejected')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed')),
  contact_name text not null,
  contact_wa text not null,
  contact_email text,
  first_name_order text check (first_name_order in ('pria','wanita')),
  religion text check (religion in ('muslim','non_muslim')),
  data jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.guest_order_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.guest_orders(id) on delete cascade,
  kind text not null check (kind in ('album','bride','groom','video','other')),
  url text not null,
  drive_file_id text,
  created_at timestamptz not null default now()
);
create index if not exists idx_guest_orders_status on public.guest_orders(status);
create index if not exists idx_guest_orders_template on public.guest_orders(template_slug);
create index if not exists idx_guest_order_files_order on public.guest_order_files(order_id);

alter table public.guest_orders enable row level security;
alter table public.guest_order_files enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='guest_orders' and policyname='guest_orders_public_insert') then
    create policy "guest_orders_public_insert" on public.guest_orders for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='guest_orders' and policyname='guest_orders_public_select') then
    create policy "guest_orders_public_select" on public.guest_orders for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='guest_order_files' and policyname='guest_order_files_public_all') then
    create policy "guest_order_files_public_all" on public.guest_order_files for all using (true) with check (true);
  end if;
end $$;

create or replace function public.set_guest_orders_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists guest_orders_updated_at on public.guest_orders;
create trigger guest_orders_updated_at before update on public.guest_orders for each row execute procedure public.set_guest_orders_updated_at();
