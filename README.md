# Panel de Vida

Dashboard personal que junta Google Calendar, Gmail y tareas en una sola página, y manda un resumen por correo cada mañana.

**Stack:** Next.js (App Router) + TypeScript, Tailwind CSS + shadcn/ui, Supabase (Postgres, Auth, RLS), Google Calendar y Gmail (solo lectura), API de Anthropic, Resend y Vercel Cron.

## Estado

| Fase | Contenido | Estado |
|---|---|---|
| a | Proyecto base, login con Google, acceso denegado, migraciones | ✅ |
| b | Google OAuth (calendar + gmail) y agenda | Pendiente |
| c | Correos y clasificación | Pendiente |
| d | Tareas y alertas cruzadas | Pendiente |
| e | Cron y resumen por correo | Pendiente |

## Configuración personal

Las reglas de la rutina (categorías de tareas, palabras clave del calendario, tiempos de traslado, descanso mínimo, correos prioritarios y tono del resumen) están en [`lib/config.ts`](lib/config.ts).

## Instalación local

1. Instalá Node.js 20 o superior.
2. `npm install`
3. Copiá `.env.example` como `.env.local` y completá las variables.
4. `npm run dev` y abrí http://localhost:3000

## Base de datos

Las migraciones están en `supabase/migrations/`. Para aplicarlas, pegá cada archivo en orden en **Supabase > SQL Editor** y tocá **Run**. Todas las tablas tienen Row Level Security: cada fila solo es visible para su `user_id`.

## Acceso

Solo entra el correo de `ALLOWED_EMAIL`. Cualquier otra cuenta de Google ve la pantalla de "acceso denegado" (lo controlan `middleware.ts` y `app/auth/callback/route.ts`).

## Por qué la app de Google Cloud queda en modo "Testing"

Los permisos de Gmail (`gmail.readonly`) son "restringidos": para que cualquier persona pueda usarlos, Google exige una verificación de seguridad paga y una revisión de la app. Como este panel es de uso personal, la app se queda en modo **Testing** con tu correo como único usuario de prueba, lo que no requiere verificación.

La contra: en modo Testing Google vence el permiso cada 7 días. Cuando pase, tocá **Reconectar** en la sección "Estado de conexiones".

## Seguridad

- La app nunca envía, borra ni modifica correos ni eventos: solo lectura.
- Todas las llaves van en variables de entorno, nunca en el código.
