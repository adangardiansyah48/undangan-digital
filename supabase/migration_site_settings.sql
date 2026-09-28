create table if not exists public.site_settings (
  id text primary key,
  value text,
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id, value) values ('logo_url', '/logo.svg') on conflict (id) do nothing;
alter table public.site_settings enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='site_settings' and policyname='site_settings_public_read') then
    create policy "site_settings_public_read" on public.site_settings for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='site_settings' and policyname='site_settings_admin_all') then
    create policy "site_settings_admin_all" on public.site_settings for all using (
      exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','superadmin'))
    ) with check (
      exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','superadmin'))
    );
  end if;
end $$;
