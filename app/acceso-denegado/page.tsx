import { Button } from "@/components/ui/button";

export default function AccesoDenegadoPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-8 text-center shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Acceso denegado</h1>
          <p className="text-sm text-muted-foreground">
            Este panel es personal y tu cuenta no tiene permiso para entrar.
          </p>
        </div>
        <form action="/auth/signout" method="post">
          <Button type="submit" variant="outline" className="w-full">
            Salir y probar con otra cuenta
          </Button>
        </form>
      </div>
    </main>
  );
}
