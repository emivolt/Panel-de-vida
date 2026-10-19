/**
 * Configuración personal del Panel de Vida: rutina, tiempos y reglas.
 * Lo que es secreto o cambia según el entorno vive en variables de entorno;
 * todo lo demás se edita acá.
 */

/** Único correo con acceso a la app. Cualquier otro ve "acceso denegado". */
export function allowedEmail(): string {
  const email = process.env.ALLOWED_EMAIL?.trim().toLowerCase();
  if (!email) throw new Error("Falta la variable de entorno ALLOWED_EMAIL");
  return email;
}

export function isAllowedEmail(email: string | null | undefined): boolean {
  return !!email && email.trim().toLowerCase() === allowedEmail();
}

export const TIMEZONE = process.env.APP_TIMEZONE ?? "America/Argentina/Buenos_Aires";

/** Hora local del resumen matutino. El cron de vercel.json usa esta hora pasada a UTC. */
export const BRIEF_TIME = { hour: 6, minute: 45 };

/* ------------------------------------------------------------------ */
/* Tareas                                                              */
/* ------------------------------------------------------------------ */

/** Categorías fijas. Deben coincidir con el check de la tabla tasks. */
export const TASK_CATEGORIES = [
  "Medicina",
  "Trabajo",
  "Trámites",
  "Casa",
  "Novia",
  "Entrenamiento",
  "Finanzas",
] as const;
export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export const TASK_PRIORITIES = ["alta", "media", "baja"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATES = ["pendiente", "en_progreso", "hecha"] as const;
export type TaskState = (typeof TASK_STATES)[number];

/* ------------------------------------------------------------------ */
/* Calendario: un solo calendario, clasificado por palabras clave      */
/* ------------------------------------------------------------------ */

export type EventKind = "trabajo" | "facultad" | "personal";

/** Se buscan en el título o la descripción del evento, sin importar mayúsculas ni tildes. */
export const EVENT_KEYWORDS: Record<Exclude<EventKind, "personal">, string[]> = {
  trabajo: ["guardia", "trabajo", "turno", "servicio"],
  facultad: ["unaj", "medicina", "teorico", "practico", "comision", "parcial", "final"],
};

/** Minutos de traslado de ida (antes) y de vuelta (después) según el tipo de evento. */
export const TRAVEL_BUFFER_MINUTES: Record<EventKind, { ida: number; vuelta: number }> = {
  trabajo: { ida: 120, vuelta: 120 },
  facultad: { ida: 60, vuelta: 60 },
  personal: { ida: 30, vuelta: 30 },
};

/** Descanso mínimo no negociable entre compromisos, contando los traslados. */
export const MIN_REST_HOURS = 4;

/* ------------------------------------------------------------------ */
/* Correos                                                             */
/* ------------------------------------------------------------------ */

/**
 * Un correo es de máxima prioridad si el remitente o el asunto contiene
 * alguno de estos términos (sin importar mayúsculas ni tildes).
 */
export const PRIORITY_EMAIL_KEYWORDS = {
  facultad: ["unaj", "siu guarani", "guarani", "alumnos", "medicina"],
  trabajo: ["trabajo", "seguridad", "guardia"],
  finanzas: ["mercado pago", "mercadopago", "transferencia", "resumen", "banco"],
};

/* ------------------------------------------------------------------ */
/* Resumen matutino                                                    */
/* ------------------------------------------------------------------ */

export const BRIEF_TONE = `Escribí en español rioplatense natural y directo, con voseo sobrio \
(tenés, acordate, fijate, arrancás). Nada de modismos exagerados ni de formalismos corporativos. \
Tiene que poder leerse en menos de 90 segundos.`;

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

/** Minúsculas y sin tildes, para comparar palabras clave. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function classifyEvent(title: string, description = ""): EventKind {
  const text = normalize(`${title} ${description}`);
  const has = (words: string[]) => words.some((w) => new RegExp(`\\b${w}\\b`).test(text));
  // Facultad primero: "Trabajo práctico" es de la facultad, no del trabajo.
  if (has(EVENT_KEYWORDS.facultad)) return "facultad";
  if (has(EVENT_KEYWORDS.trabajo)) return "trabajo";
  return "personal";
}

export function isPriorityEmail(from: string, subject: string): boolean {
  const text = normalize(`${from} ${subject}`);
  return Object.values(PRIORITY_EMAIL_KEYWORDS)
    .flat()
    .some((w) => text.includes(w));
}
