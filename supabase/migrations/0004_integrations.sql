-- Conexiones con servicios externos. El refresh token se guarda cifrado por la app
-- (AES-256-GCM con ENCRYPTION_KEY), así que la base nunca lo tiene en claro.
create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  proveedor text not null check (proveedor in ('google')),
  refresh_token_cifrado text not null,
  ultima_sincronizacion timestamptz,
  unique (user_id, proveedor)
);

alter table public.integrations enable row level security;

create policy "Cada usuario ve y edita solo sus integraciones"
  on public.integrations for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
