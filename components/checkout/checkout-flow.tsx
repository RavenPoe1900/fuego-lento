"use client";

import { Bike, Check, Copy, MessageCircle, ShoppingBag, Store } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { CartLines } from "@/components/cart/cart-lines";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button, LinkButton } from "@/components/shared/button";
import { SelectField, TextAreaField, TextField } from "@/components/shared/field";
import { Container } from "@/components/shared/layout";
import { EmptyState, ErrorState } from "@/components/shared/state-panels";
import { restaurant } from "@/config/restaurant";
import { deliveryZones } from "@/data/delivery-zones";
import { track } from "@/lib/analytics";
import { formatPrice } from "@/lib/currency";
import { etaText, OUTSIDE_ZONE } from "@/lib/delivery";
import { isPreview } from "@/lib/dev";
import { getSlots, slotLabel } from "@/lib/schedule";
import { useOrderSummary } from "@/lib/use-order-summary";
import { useStoreStatus } from "@/lib/use-store-status";
import { addressSchema, customerSchema, fieldErrors } from "@/lib/validation";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { useCart } from "@/store/cart-store";
import { useCheckout } from "@/store/checkout-store";
import type { DeliveryMethod } from "@/types/restaurant";

const STEPS = ["Tu pedido", "Entrega", "Confirmar"] as const;
const radioCard = (on: boolean) =>
  `flex min-h-16 cursor-pointer items-start gap-4 rounded-card p-4 ring-1 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-fire ${on ? "bg-ember/15 ring-fire" : "bg-white/[0.03] ring-white/10 hover:bg-white/[0.06]"}`;

export function CheckoutFlow() {
  const cartHydrated = useCart((s) => s.hydrated);
  const clearCart = useCart((s) => s.clear);
  const co = useCheckout();
  const sum = useOrderSummary();
  const sf = useStoreStatus();
  const reduce = useReducedMotion();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sendError, setSendError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const began = useRef(false);

  const methods = ([sf.deliveryEnabled && "delivery", sf.pickupEnabled && "pickup"].filter(Boolean) as DeliveryMethod[]);
  const method: DeliveryMethod = methods.includes(co.deliveryMethod) ? co.deliveryMethod : (methods[0] ?? "pickup");
  const step = Math.min(co.step, STEPS.length - 1);
  const scheduling = restaurant.ordering.scheduledEnabled && sf.showHours;
  const slots = useMemo(() => (sf.ready && scheduling ? getSlots(new Date()) : []), [sf.ready, scheduling]);
  const payments = sf.paymentsConfirmed ? restaurant.paymentMethods.filter((p) => p.enabled && p.deliveryMethods.includes(method)) : [];
  const zones = deliveryZones.filter((z) => z.available);

  useEffect(() => {
    if (cartHydrated && sum.lines.length && sf.orderingEnabled && !began.current) {
      began.current = true;
      track("checkout_started");
    }
  }, [cartHydrated, sum.lines.length, sf.orderingEnabled]);

  // Si solo hay horario programado, forzarlo
  useEffect(() => {
    if (sf.ready && scheduling && !sf.canOrderNow && co.schedule.type === "asap") co.set({ schedule: { type: "scheduled", slot: "" } });
  }, [sf.ready, scheduling, sf.canOrderNow, co]);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [step, reduce]);

  if (!cartHydrated || !sf.ready) return <Container className="py-24"><div className="skeleton h-64" role="status" aria-label="Cargando" /></Container>;

  if (!sf.orderingEnabled)
    return (
      <Shell>
        <EmptyState title={sf.message || "Ahora mismo no estamos recibiendo pedidos"} text="Cuando volvamos a recibir pedidos podrás hacerlo desde aquí.">
          <LinkButton href={restaurant.instagram.url} external variant="secondary">Seguir en Instagram</LinkButton>
        </EmptyState>
      </Shell>
    );

  if (sum.lines.length === 0)
    return (
      <Shell>
        <EmptyState icon={<ShoppingBag className="size-9" aria-hidden />} title="Tu pedido todavía está vacío" text="Añade algo del menú para continuar.">
          <LinkButton href="/menu/">Explorar el menú</LinkButton>
        </EmptyState>
      </Shell>
    );

  if (!sf.canOrder)
    return (
      <Shell>
        <ErrorState title="Ahora mismo estamos cerrados" text="No estamos aceptando pedidos en este momento. Tu pedido se conserva para cuando abramos.">
          <LinkButton href="/menu/" variant="secondary">Volver al menú</LinkButton>
        </ErrorState>
      </Shell>
    );

  const scheduleLabel = co.schedule.type === "scheduled" && co.schedule.slot ? slotLabel(co.schedule.slot, slots) : null;
  const summary = { ...sum.summary, deliveryMethod: method, scheduleLabel, address: method === "delivery" ? co.address : null };
  const feeKnown = sum.totals.deliveryFee !== null;

  /** Valida el paso indicado; devuelve true si se puede avanzar. */
  const validate = (target: number): boolean => {
    const next: Record<string, string> = {};
    if (target === 0 && sum.issues.length) next.lines = "Algunos productos cambiaron. Edítalos o elimínalos para continuar.";
    if (target === 1) {
      const c = customerSchema.safeParse(co.customer);
      if (!c.success) Object.assign(next, fieldErrors(c.error));
      if (method === "delivery") {
        const a = addressSchema.safeParse(co.address);
        if (!a.success) Object.assign(next, fieldErrors(a.error));
        if (sum.coverage?.status === "outside") next.zoneId = "Tu dirección está fuera de nuestra cobertura. " + (sf.pickupEnabled ? "Puedes elegir recogida en el restaurante." : "");
        else if (sum.coverage?.status === "covered" && sum.coverage.missing > 0) next.zoneId = `Para tu zona el pedido mínimo es ${formatPrice(sum.coverage.minOrder as number)}. Te faltan ${formatPrice(sum.coverage.missing)}.`;
      }
      if (co.schedule.type === "scheduled" && !co.schedule.slot) next.slot = "Elige una franja horaria disponible.";
    }
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true'], [data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" }));
      return false;
    }
    return true;
  };

  const go = (to: number) => {
    if (to > step && !validate(step)) return;
    setErrors({});
    co.set({ step: Math.max(0, Math.min(STEPS.length - 1, to)) });
  };

  const message = buildWhatsAppMessage(summary, sf.businessName);
  const url = buildWhatsAppUrl(sf.whatsappNumber, message);

  const send = () => {
    setSendError(null);
    if (!validate(0)) return co.set({ step: 0 });
    if (!validate(1)) return co.set({ step: 1 });
    if (!url) return setSendError("Falta configurar el número de WhatsApp del restaurante. Puedes copiar el resumen y enviarlo manualmente.");
    track("whatsapp_order_clicked");
    co.set({ whatsappOpenedAt: new Date().toISOString() });
    // Acción iniciada directamente por el usuario: evita el bloqueo de ventanas emergentes.
    const w = window.open(url, "_blank");
    if (w) w.opener = null;
    else window.location.assign(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      track("order_summary_copied");
      toast.success("Resumen copiado");
    } catch {
      setSendError("No pudimos copiar el resumen. Selecciónalo y cópialo manualmente.");
    }
  };

  const clearAll = () => {
    clearCart();
    co.set({ whatsappOpenedAt: null, step: 0 });
    toast("Pedido vaciado");
  };

  const upd = <K extends "customer" | "address">(key: K, patch: Partial<(typeof co)[K]>) => co.set({ [key]: { ...co[key], ...patch } } as never);

  return (
    <Shell>
      <nav aria-label="Pasos del pedido" className="mb-8 max-w-2xl">
        <ol className="grid grid-cols-3 gap-2">
          {STEPS.map((label, i) => (
            <li key={label} aria-current={i === step ? "step" : undefined}>
              <div className={`h-1 rounded-full transition-colors duration-200 ${i <= step ? "bg-accent" : "bg-white/10"}`} />
              <span className={`mt-2 flex items-center gap-1.5 text-sm ${i === step ? "font-semibold text-cream" : "text-cream2"}`}>
                {i < step && <Check className="size-3.5 text-ok" aria-hidden />}
                {i + 1}. {label}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="editorial-grid gap-y-10">
        <div className="col-span-12 lg:col-span-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={step}
              initial={reduce ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              aria-labelledby="step-title"
            >
              <h2 id="step-title" ref={headingRef} tabIndex={-1} className="t-h3 mb-6 outline-none">{STEPS[step]}</h2>

              {step === 0 && (
                <div>
                  <CartLines />
                  {errors.lines && <p role="alert" data-error className="mt-4 text-sm text-err">{errors.lines}</p>}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-8">
                  {methods.length > 1 && (
                    <div role="radiogroup" aria-label="Modalidad" className="grid gap-3 sm:grid-cols-2">
                      {methods.map((m) => {
                        const on = method === m;
                        const Icon = m === "delivery" ? Bike : Store;
                        return (
                          <label key={m} className={radioCard(on)}>
                            <input type="radio" name="method" className="sr-only" checked={on} onChange={() => { co.set({ deliveryMethod: m, paymentMethod: null }); track("fulfillment_selected", { method: m }); setErrors({}); }} />
                            <Icon className="mt-0.5 size-6 text-accent" aria-hidden />
                            <span>
                              <span className="block font-semibold">{m === "delivery" ? "Entrega a domicilio" : "Recogida en el restaurante"}</span>
                              <span className="text-sm text-cream2">{m === "delivery" ? "Te lo llevamos a tu dirección." : "Sin costo de envío."}</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField id="name" label="Nombre" required autoComplete="name" value={co.customer.name} error={errors.name} onChange={(e) => upd("customer", { name: e.target.value })} />
                    <TextField id="phone" label="Teléfono" required type="tel" inputMode="tel" autoComplete="tel" hint="8 dígitos, por ejemplo 5X XXX XXX" value={co.customer.phone} error={errors.phone} onChange={(e) => upd("customer", { phone: e.target.value })} />
                  </div>

                  {method === "delivery" && (
                    <div className="space-y-4">
                      <SelectField id="zoneId" label="Zona de entrega" required value={co.address.zoneId} error={errors.zoneId} onChange={(e) => upd("address", { zoneId: e.target.value })}>
                        <option value="">Elige tu zona</option>
                        {zones.map((z) => (<option key={z.id} value={z.id}>{z.name}{z.fee !== null ? ` · ${formatPrice(z.fee)}` : ""}</option>))}
                        <option value={OUTSIDE_ZONE}>Mi zona no aparece en la lista</option>
                      </SelectField>
                      <div aria-live="polite">
                        {sum.coverage?.status === "covered" && (
                          <p className="rounded-ui bg-ok/10 p-3 text-sm">
                            <strong>Sí entregamos en tu zona.</strong> {sum.coverage.fee !== null ? `Envío ${formatPrice(sum.coverage.fee)}` : "Envío por confirmar"}{etaText(sum.coverage.zone) ? ` · ${etaText(sum.coverage.zone)}` : ""}.
                          </p>
                        )}
                        {sum.coverage?.status === "outside" && sf.pickupEnabled && (
                          <p className="text-sm text-cream2">
                            Puedes <button type="button" className="font-medium text-cream underline underline-offset-4" onClick={() => { co.set({ deliveryMethod: "pickup", paymentMethod: null }); setErrors({}); }}>elegir recogida en el restaurante</button>.
                          </p>
                        )}
                      </div>
                      <TextField id="street" label="Dirección" required autoComplete="street-address" hint="Calle, número, apartamento" value={co.address.street} error={errors.street} onChange={(e) => upd("address", { street: e.target.value })} />
                      <TextField id="reference" label="Referencia para localizar el lugar" required value={co.address.reference} error={errors.reference} onChange={(e) => upd("address", { reference: e.target.value })} />
                      <TextField id="instructions" label="Instrucciones para el repartidor" value={co.address.instructions} onChange={(e) => upd("address", { instructions: e.target.value })} />
                    </div>
                  )}

                  {scheduling && (
                    <div className="space-y-4">
                      <div role="radiogroup" aria-label={method === "pickup" ? "Hora de recogida" : "Horario"} className="grid gap-3 sm:grid-cols-2">
                        <label className={`${radioCard(co.schedule.type === "asap")} ${sf.canOrderNow ? "" : "!cursor-not-allowed opacity-45"}`}>
                          <input type="radio" name="when" className="sr-only" disabled={!sf.canOrderNow} checked={co.schedule.type === "asap"} onChange={() => co.set({ schedule: { type: "asap" } })} />
                          <span><span className="block font-semibold">Lo antes posible</span><span className="text-sm text-cream2">{sf.canOrderNow ? "Sujeto a confirmación." : "No disponible ahora."}</span></span>
                        </label>
                        <label className={radioCard(co.schedule.type === "scheduled")}>
                          <input type="radio" name="when" className="sr-only" checked={co.schedule.type === "scheduled"} onChange={() => co.set({ schedule: { type: "scheduled", slot: "" } })} />
                          <span><span className="block font-semibold">{method === "pickup" ? "Hora deseada" : "Programar"}</span><span className="text-sm text-cream2">Elige día y hora.</span></span>
                        </label>
                      </div>
                      {co.schedule.type === "scheduled" && (
                        slots.length === 0 ? (
                          <p role="alert" className="text-sm text-err">No hay franjas disponibles por ahora. Inténtalo más tarde.</p>
                        ) : (
                          <SelectField id="slot" label="Franja horaria" required value={co.schedule.slot} error={errors.slot} onChange={(e) => co.set({ schedule: { type: "scheduled", slot: e.target.value } })}>
                            <option value="">Elige una franja</option>
                            {[...new Set(slots.map((s) => s.day))].map((day) => (
                              <optgroup key={day} label={day}>{slots.filter((s) => s.day === day).map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</optgroup>
                            ))}
                          </SelectField>
                        )
                      )}
                    </div>
                  )}

                  {payments.length > 0 && (
                    <fieldset>
                      <legend className="mb-3 font-semibold">Método de pago preferido</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {payments.map((p) => (
                          <label key={p.id} className={radioCard(co.paymentMethod === p.id)}>
                            <input type="radio" name="pay" className="sr-only" checked={co.paymentMethod === p.id} onChange={() => co.set({ paymentMethod: p.id })} />
                            <span className="font-semibold">{p.label}</span>
                          </label>
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-muted">Es solo una preferencia: el pago se coordina por WhatsApp.</p>
                    </fieldset>
                  )}

                  <TextAreaField id="notes" label="Observaciones generales" maxLength={300} value={co.customer.notes} onChange={(e) => upd("customer", { notes: e.target.value })} />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-7">
                  <dl className="grid gap-x-8 gap-y-4 text-[0.9375rem] sm:grid-cols-2">
                    <Info label="Cliente" value={`${co.customer.name} · ${co.customer.phone}`} />
                    <Info label="Modalidad" value={method === "delivery" ? "Entrega a domicilio" : "Recogida en el restaurante"} />
                    {method === "delivery" && <Info label="Dirección" value={`${co.address.street}${sum.coverage?.status === "covered" ? ` · ${sum.coverage.zone.name}` : ""}`} />}
                    {method === "delivery" && <Info label="Referencia" value={co.address.reference} />}
                    {scheduleLabel && <Info label="Horario solicitado" value={scheduleLabel} />}
                    <Info label="Pago preferido" value={summary.paymentLabel ?? "Por coordinar"} />
                    {co.customer.notes && <Info label="Observaciones" value={co.customer.notes} />}
                  </dl>
                  <div>
                    <h3 className="mb-3 text-[1.25rem]">Productos</h3>
                    <ul className="divide-y divide-white/[0.07]">
                      {sum.priced.map((l) => (
                        <li key={l.lineId} className="flex justify-between gap-4 py-3">
                          <div>
                            <p className="font-medium">{l.quantity} × {l.name}</p>
                            {l.details.map((d) => <p key={d} className="text-sm text-cream2">{d}</p>)}
                            {l.note && <p className="text-sm italic text-cream2">“{l.note}”</p>}
                          </div>
                          <span className="tabular-nums">{formatPrice(l.lineTotal)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <CartSummary totals={sum.totals} method={method} />
                  {method === "delivery" && !feeKnown && <p className="text-sm text-cream2">El costo de envío lo confirma el restaurante por WhatsApp.</p>}
                </div>
              )}

              {sendError && <p role="alert" className="mt-5 rounded-ui bg-err/10 p-3 text-sm text-err">{sendError}</p>}

              {/* Acciones */}
              <div className="mt-8 space-y-4">
                {step < 2 ? (
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    {step > 0 ? <Button variant="ghost" size="lg" onClick={() => go(step - 1)}>Atrás</Button> : <LinkButton href="/menu/" variant="ghost" size="lg">Seguir viendo el menú</LinkButton>}
                    <Button size="lg" onClick={() => go(step + 1)} className="sm:min-w-52">Continuar</Button>
                  </div>
                ) : (
                  <>
                    <Button size="lg" className="w-full !min-h-[56px]" onClick={send} disabled={!url && !isPreview ? true : false} aria-describedby="wa-note">
                      <MessageCircle className="size-5" aria-hidden /> {co.whatsappOpenedAt ? "Volver a abrir WhatsApp" : "Enviar pedido por WhatsApp"}
                    </Button>
                    <p id="wa-note" className="text-sm leading-snug text-cream2">
                      <strong className="text-cream">El pedido queda pendiente de confirmación por el restaurante.</strong> Al continuar, se abrirá WhatsApp con el resumen. El restaurante deberá confirmar disponibilidad, importe final y entrega.
                    </p>
                    {!url && isPreview && <p className="text-sm text-gold">[DEV] Define NEXT_PUBLIC_WHATSAPP_NUMBER para abrir WhatsApp; mientras tanto puedes copiar el resumen.</p>}
                    {co.whatsappOpenedAt && (
                      <div role="status" className="rounded-card bg-white/[0.04] p-4 text-[0.9375rem]">
                        <p className="font-semibold">WhatsApp abierto.</p>
                        <p className="mt-1 text-cream2">Conservaremos tu pedido por si necesitas volver. Cuando el restaurante responda por WhatsApp, tu pedido quedará confirmado.</p>
                        {sf.whatsappNumber && <p className="mt-2 text-sm text-cream2">¿No se abrió? Escribe a +{sf.whatsappNumber} y pega el resumen.</p>}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                      <Button variant="secondary" size="sm" onClick={copy}><Copy className="size-4" aria-hidden /> Copiar resumen</Button>
                      <Button variant="ghost" size="sm" onClick={() => go(1)}>Editar datos</Button>
                      {co.whatsappOpenedAt && <Button variant="link" size="sm" onClick={clearAll}>Vaciar pedido</Button>}
                    </div>
                  </>
                )}
              </div>
            </motion.section>
          </AnimatePresence>
        </div>

        {step > 0 && (
          <aside aria-label="Resumen del pedido" className="col-span-12 h-fit rounded-card bg-white/[0.03] p-5 ring-1 ring-white/[0.07] lg:col-span-4 lg:col-start-9 lg:sticky lg:top-[calc(var(--header-height)+24px)]">
            <h2 className="mb-3 text-[1.5rem]">Tu pedido</h2>
            <ul className="mb-4 space-y-2 text-sm">
              {sum.priced.map((l) => (<li key={l.lineId} className="flex justify-between gap-3"><span>{l.quantity} × {l.name}</span><span className="tabular-nums text-cream2">{formatPrice(l.lineTotal)}</span></li>))}
            </ul>
            <CartSummary totals={sum.totals} method={method} />
          </aside>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Container className="py-10 lg:py-14">
      <h1 className="t-h2 mb-8">Finalizar pedido</h1>
      {children}
    </Container>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
