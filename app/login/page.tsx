import { LoginButton } from "./login-button";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-8 text-center shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Panel de Vida</h1>
          <p className="text-sm text-muted-foreground">
            Tu calendario, tu correo y tus tareas en una sola página.
          </p>
        </div>
        <LoginButton />
      </div>
    </main>
  );
}
