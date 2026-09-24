-- Undangan Digital — Supabase PostgreSQL schema
-- Jalankan di Supabase SQL Editor

create extension if not exists "pgcrypto";

-- Profiles (mirror auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  phone text,
  full_name text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer','designer','admin','superadmin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null check (category in ('wedding','adat','animasi','non-wedding')),
  subcategory text,
  title text not null,
  description text,
  thumbnail_url text,
  preview_url text,
  is_premium boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  template_id uuid references public.templates(id) on delete set null,
  slug text unique not null,
  custom_domain text,
  title text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  track text not null default 'self' check (track in ('self','assisted')),
  tier text not null default 'bronze' check (tier in ('bronze','silver','gold','platinum')),
  expired_at timestamptz,
  data jsonb not null default '{}'::jsonb,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  name text not null,
  slug text not null,
  phone text,
  email text,
  rsvp_status text default 'pending' check (rsvp_status in ('pending','hadir','tidak','ragu')),
  rsvp_count integer not null default 1,
  rsvp_message text,
  created_at timestamptz not null default now(),
  unique (invitation_id, slug)
);

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text not null,
  message text not null,
  rsvp_status text check (rsvp_status in ('hadir','tidak','ragu')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  invitation_id uuid references public.invitations(id) on delete set null,
  tier text not null,
  amount numeric(15,2) not null,
  payment_method text,
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  track text not null default 'self' check (track in ('self','assisted')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.assistance_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  invitation_id uuid references public.invitations(id) on delete set null,
  template_id uuid references public.templates(id) on delete set null,
  category text,
  brief text,
  status text not null default 'pending' check (status in ('pending','in_progress','review','done','rejected')),
  designer_id uuid references public.profiles(id) on delete set null,
  deadline timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  type text not null check (type in ('photo','video')),
  url text not null,
  drive_file_id text,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_slug text,
  ip_address inet,
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

create table if not exists public.gdrive_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_invitations_user on public.invitations(user_id);
create index if not exists idx_invitations_slug on public.invitations(slug);
create index if not exists idx_invitations_status on public.invitations(status);
create index if not exists idx_guests_invitation on public.guests(invitation_id);
create index if not exists idx_wishes_invitation on public.wishes(invitation_id);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_gallery_invitation on public.gallery_items(invitation_id);
create index if not exists idx_analytics_invitation on public.analytics(invitation_id);
create index if not exists idx_templates_category on public.templates(category);

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists invitations_updated_at on public.invitations;
create trigger invitations_updated_at before update on public.invitations
  for each row execute procedure public.set_updated_at();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.templates enable row level security;
alter table public.invitations enable row level security;
alter table public.guests enable row level security;
alter table public.wishes enable row level security;
alter table public.orders enable row level security;
alter table public.assistance_requests enable row level security;
alter table public.gallery_items enable row level security;
alter table public.analytics enable row level security;
alter table public.gdrive_tokens enable row level security;

-- Profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Templates public
create policy "templates_public_read" on public.templates for select using (is_active = true);

-- Invitations
create policy "invitations_owner_all" on public.invitations for all using (auth.uid() = user_id);
create policy "invitations_public_published" on public.invitations
  for select using (status = 'published');

-- Guests
create policy "guests_owner" on public.guests
  for all using (
    exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid())
  );
create policy "guests_public_read_published" on public.guests
  for select using (
    exists (select 1 from public.invitations i where i.id = invitation_id and i.status = 'published')
  );

-- Wishes
create policy "wishes_public_read" on public.wishes
  for select using (
    exists (select 1 from public.invitations i where i.id = invitation_id and i.status = 'published')
  );
create policy "wishes_public_insert" on public.wishes
  for insert with check (
    exists (select 1 from public.invitations i where i.id = invitation_id and i.status = 'published')
  );
create policy "wishes_owner" on public.wishes
  for all using (
    exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid())
  );

-- Orders
create policy "orders_owner" on public.orders for all using (auth.uid() = user_id);

-- Assistance
create policy "assistance_owner" on public.assistance_requests for all using (auth.uid() = user_id);

-- Gallery
create policy "gallery_owner" on public.gallery_items
  for all using (
    exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid())
  );
create policy "gallery_public_read" on public.gallery_items
  for select using (
    exists (select 1 from public.invitations i where i.id = invitation_id and i.status = 'published')
  );

-- Analytics
create policy "analytics_insert_public" on public.analytics for insert with check (true);
create policy "analytics_owner_read" on public.analytics
  for select using (
    exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid())
  );

-- Gdrive tokens
create policy "gdrive_owner" on public.gdrive_tokens for all using (auth.uid() = user_id);

-- Seed templates
insert into public.templates (slug, category, subcategory, title, description, thumbnail_url, is_premium, sort_order) values
  ('classic-ivory', 'wedding', null, 'Classic Ivory', 'Elegan klasik dengan palet ivory & gold', '/templates/classic-ivory.jpg', false, 1),
  ('modern-minimal', 'wedding', null, 'Modern Minimal', 'Desain bersih, tipografi modern', '/templates/modern-minimal.jpg', false, 2),
  ('floral-blush', 'wedding', null, 'Floral Blush', 'Bunga blush pink romantis', true, 3),
  ('adat-jawa', 'adat', 'jawa', 'Adat Jawa', 'Nuansa solo-jogja, batik & gunungan', true, 4),
  ('adat-sunda', 'adat', 'sunda', 'Adat Sunda', 'Panggih sunda, warna hijau-kuning', true, 5),
  ('adat-minang', 'adat', 'minang', 'Adat Minang', 'Motif songket & rumah gadang', true, 6),
  ('adat-batak', 'adat', 'batak', 'Adat Batak', 'Ulos & gorga', true, 7),
  ('adat-bali', 'adat', 'bali', 'Adat Bali', 'Pura, canang, emas-merah', true, 8),
  ('adat-melayu', 'adat', 'melayu', 'Adat Melayu', 'Tepak sirih, songket kuning', true, 9),
  ('animasi-1', 'animasi', null, 'Animasi Soft', 'Transisi lembut + particle', true, 10),
  ('khitan-1', 'non-wedding', 'khitan', 'Khitanan Ceria', 'Tema anak, warna cerah', false, 11),
  ('aqiqah-1', 'non-wedding', 'aqiqah', 'Aqiqah Soft', 'Tema bayi, pastel', false, 12),
  ('birthday-1', 'non-wedding', 'birthday', 'Ultah Anak', 'Kartun & confetti', false, 13)
on conflict (slug) do nothing;
