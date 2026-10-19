import { NextResponse } from "next/server";

import { isAllowedEmail } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

/** Google vuelve acá después del login. Solo deja pasar al correo permitido. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login`);
  }
  if (!isAllowedEmail(data.user?.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/acceso-denegado`);
  }

  return NextResponse.redirect(`${origin}/`);
}
