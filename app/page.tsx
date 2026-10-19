import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TIMEZONE } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

const SECCIONES = [
  { titulo: "Hoy en una línea", fase: "b" },
  { titulo: "Agenda", fase: "b" },
  { titulo: "Correos", fase: "c" },
  { titulo: "Tareas", fase: "d" },
  { titulo: "Alertas cruzadas", fase: "d" },
  { titulo: "Estado de conexiones", fase: "e" },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hoy = new Intl.DateTimeFormat("es-AR", {
    timeZone: TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Panel de Vida</h1>
          <p className="text-sm capitalize text-muted-foreground">{hoy}</p>
        </div>
        <form action="/auth/signout" method="post">
          <Button type="submit" variant="ghost" size="sm">
            Salir
          </Button>
        </form>
      </header>

      <p className="text-sm text-muted-foreground">Entraste como {user?.email}.</p>

      <div className="grid gap-4">
        {SECCIONES.map((s) => (
          <Card key={s.titulo}>
            <CardHeader>
              <CardTitle>{s.titulo}</CardTitle>
              <CardDescription>Llega en la fase ({s.fase}).</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}
