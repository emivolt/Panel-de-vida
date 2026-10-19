-- Tareas personales, agrupadas en categorías fijas.
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  titulo text not null,
  descripcion text,
  fecha_limite timestamptz,
  prioridad text not null default 'media'
    check (prioridad in ('alta', 'media', 'baja')),
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'en_progreso', 'hecha')),
  categoria text not null
    check (categoria in ('Medicina', 'Trabajo', 'Trámites', 'Casa', 'Novia', 'Entrenamiento', 'Finanzas')),
  proyecto text,
  created_at timestamptz not null default now()
);

create index tasks_user_fecha_idx on public.tasks (user_id, fecha_limite);

alter table public.tasks enable row level security;

create policy "Cada usuario ve y edita solo sus tareas"
  on public.tasks for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
