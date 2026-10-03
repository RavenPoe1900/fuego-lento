import { z } from "zod";
import { sanitizeText } from "@/lib/text";

const clean = (max: number) => z.string().transform((v) => sanitizeText(v, max));

/** Teléfonos cubanos: 8 dígitos, con o sin prefijo 53 / +53. */
const phone = z
  .string()
  .transform((v) => v.replace(/[\s().-]/g, ""))
  .refine((v) => /^(\+?53)?\d{8}$/.test(v), "Escribe un teléfono válido de 8 dígitos, por ejemplo 5X XXX XXX.");

export const customerSchema = z.object({
  name: clean(80).pipe(z.string().min(2, "Escribe tu nombre.")),
  phone,
  notes: clean(300),
});

export const addressSchema = z.object({
  zoneId: z.string().min(1, "Elige tu zona de entrega."),
  street: clean(160).pipe(z.string().min(4, "Escribe la dirección completa: calle, número y apartamento.")),
  reference: clean(200).pipe(z.string().min(3, "Añade una referencia para localizar el lugar.")),
  instructions: clean(200),
});

export const reopeningSchema = z
  .object({
    name: clean(60).pipe(z.string().min(2, "Escribe tu nombre.")),
    contact: clean(120).pipe(z.string().min(5, "Escribe tu teléfono o correo.")),
    consent: z.literal(true, "Necesitamos tu permiso para avisarte."),
  })
  .refine((v) => /^(\+?53)?\d{8}$/.test(v.contact.replace(/[\s().-]/g, "")) || z.email().safeParse(v.contact).success, {
    path: ["contact"],
    message: "Escribe un teléfono de 8 dígitos o un correo válido.",
  });

/** Convierte un ZodError en { campo: mensaje } */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
