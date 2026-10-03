"use client";

import { CheckCircle2 } from "lucide-react";
import { Instagram } from "@/components/shared/icons";
import { useState, type FormEvent } from "react";
import { Button, LinkButton } from "@/components/shared/button";
import { TextField } from "@/components/shared/field";
import { Dialog } from "@/components/shared/modal";
import { restaurant } from "@/config/restaurant";
import { track } from "@/lib/analytics";
import { isDev } from "@/lib/dev";
import { demoReopeningRepository } from "@/lib/reopening";
import { fieldErrors, reopeningSchema } from "@/lib/validation";
import { useUi } from "@/store/ui-store";

export function ReopeningDialog() {
  const open = useUi((s) => s.reopeningOpen);
  const setOpen = useUi((s) => s.setReopeningOpen);
  return (
    <Dialog open={open} onClose={() => setOpen(false)} title="Avísame de la reapertura">
      <ReopeningForm />
    </Dialog>
  );
}

export function ReopeningForm({ compact }: { compact?: boolean }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = reopeningSchema.safeParse({ name, contact, consent });
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setState("loading");
    try {
      await demoReopeningRepository.register({ name: parsed.data.name, contact: parsed.data.contact });
      track("reopening_signup");
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done")
    return (
      <div role="status" className="flex flex-col items-center gap-3 p-8 text-center">
        <CheckCircle2 className="size-10 text-ok" aria-hidden />
        <h3 className="text-3xl">¡Listo, {name.split(" ")[0]}!</h3>
        <p className="max-w-sm text-cream2">Te avisaremos cuando Fuego Lento vuelva a encender el fuego.</p>
        {isDev && <p className="text-xs text-gold">[DEV] El registro no se envía a ningún servicio.</p>}
        <LinkButton href={restaurant.instagram.url} external variant="secondary">
          <Instagram className="size-4" aria-hidden /> Seguir en Instagram
        </LinkButton>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className={`space-y-4 ${compact ? "" : "p-6"}`}>
      <p className="text-cream2">Déjanos tu contacto y te avisamos de la fecha de reapertura y las novedades.</p>
      <TextField id="re-name" label="Nombre" required autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      <TextField id="re-contact" label="Teléfono o correo" required autoComplete="tel" inputMode="text" value={contact} onChange={(e) => setContact(e.target.value)} error={errors.contact} />
      <div>
        <label className="flex min-h-11 items-start gap-3 text-sm">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-5 accent-[var(--ember)]" />
          <span className="text-cream2">
            Acepto que Fuego Lento use mis datos solo para avisarme de la reapertura.
          </span>
        </label>
        {errors.consent && <p role="alert" className="mt-1 text-sm text-err">{errors.consent}</p>}
      </div>
      {state === "error" && <p role="alert" className="text-sm text-err">No pudimos registrar tus datos. Revisa tu conexión e inténtalo otra vez.</p>}
      <Button type="submit" size="lg" className="w-full" loading={state === "loading"}>
        Avisarme de la reapertura
      </Button>
    </form>
  );
}
