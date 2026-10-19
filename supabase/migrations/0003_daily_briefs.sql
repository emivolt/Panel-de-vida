-- Resúmenes matutinos generados (uno por día).
create table public.daily_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  fecha date not null,
  contenido_markdown text not null,
  enviado boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, fecha)
);

alter table public.daily_briefs enable row level security;

create policy "Cada usuario ve y edita solo sus resúmenes"
  on public.daily_briefs for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
