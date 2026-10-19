-- Clasificación de hilos de Gmail hecha por Claude, para no reclasificarlos.
create table public.email_classifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  gmail_thread_id text not null,
  categoria text not null
    check (categoria in ('responder_hoy', 'esperando_respuesta', 'informativo')),
  resumen_una_linea text,
  fecha_limite_detectada timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, gmail_thread_id)
);

alter table public.email_classifications enable row level security;

create policy "Cada usuario ve y edita solo sus clasificaciones"
  on public.email_classifications for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger email_classifications_updated_at
  before update on public.email_classifications
  for each row execute function public.set_updated_at();
