"use client";

import { CheckCircle2, MapPin, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, LinkButton } from "@/components/shared/button";
import { SelectField } from "@/components/shared/field";
import { Container, Section } from "@/components/shared/layout";
import { Dialog } from "@/components/shared/modal";
import { Price } from "@/components/shared/price";
import { SectionHeading } from "@/components/shared/section-heading";
import { content } from "@/config/content";
import { restaurant } from "@/config/restaurant";
import { faqAvailable } from "@/data/faq";
import { deliveryZones } from "@/data/delivery-zones";
import { track } from "@/lib/analytics";
import { checkCoverage, etaText, OUTSIDE_ZONE } from "@/lib/delivery";
import { hoursSummary, todayHours } from "@/lib/schedule";
import { useStoreStatus } from "@/lib/use-store-status";
import { useUi } from "@/store/ui-store";

const linkClass = "inline-flex min-h-11 items-center text-[0.9375rem] font-medium underline underline-offset-4";

/**
 * Con el servicio activo: comprobación de cobertura (resultado inmediato, detalle bajo demanda).
 * Sin servicio: bloque informativo de estado, sin zonas, costos, tiempos ni horarios.
 */
export function DeliveryCoverage() {
  const sf = useStoreStatus();
  const setReopeningOpen = useUi((s) => s.setReopeningOpen);
  const faq = faqAvailable(sf);

  if (!sf.showDelivery) {
    // Sin servicio: bloque informativo breve, sin repetir el mensaje de estado ni duplicar acciones.
    return (
      <Section id="cobertura" tone="paper" labelledBy="cobertura-t" pad={false} className="py-12 lg:py-16">
        <Container size="narrow">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3 !text-ember">Entrega</p>
            <h2 id="cobertura-t" className="t-h3">{content.coverage.title}</h2>
            <p className="lead mt-3 text-ink/75">{content.coverage.closedText}</p>
            {(sf.signupEnabled || faq) && (
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {sf.signupEnabled && <Button size="lg" onClick={() => setReopeningOpen(true)}>{content.hero.closed.signupCta}</Button>}
                {faq && <Link href="/preguntas-frecuentes/" className={linkClass}>Preguntas frecuentes</Link>}
              </div>
            )}
          </div>
        </Container>
      </Section>
    );
  }
  return <CoverageChecker faq={faq} />;
}

function CoverageChecker({ faq }: { faq: boolean }) {
  const sf = useStoreStatus();
  const [zoneId, setZoneId] = useState("");
  const [zonesOpen, setZonesOpen] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);
  const zones = deliveryZones.filter((z) => z.available);
  const result = zoneId === OUTSIDE_ZONE ? checkCoverage("none", 0) : checkCoverage(zoneId, 0);
  const today = sf.showHours && sf.ready ? todayHours() : null;

  return (
    <Section id="cobertura" tone="paper" labelledBy="cobertura-t" pad={false} className="py-16 lg:py-24">
      <Container>
        <div className="editorial-grid gap-y-10">
          <div className="col-span-12 lg:col-span-7">
          <SectionHeading id="cobertura-t" onLight eyebrow="Entrega" title={content.coverage.title} description={content.coverage.description} />

          <SelectField id="coverage-zone" label="Comprueba la disponibilidad en tu zona" required value={zoneId} onChange={(e) => { setZoneId(e.target.value); if (e.target.value === OUTSIDE_ZONE) track("coverage_error"); }}>
            <option value="">Selecciona tu zona</option>
            {zones.map((z) => (<option key={z.id} value={z.id}>{z.name}</option>))}
            <option value={OUTSIDE_ZONE}>Mi zona no aparece en la lista</option>
          </SelectField>

          <div aria-live="polite" className="mt-4">
            {result.status === "covered" && (
              <div className="rounded-card border border-ok/50 bg-ok/15 p-5">
                <p className="flex items-center gap-2 text-[1.0625rem] font-semibold"><CheckCircle2 className="size-5 text-[#3f6a30]" aria-hidden /> Sí entregamos en tu zona</p>
                <dl className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div><dt className="text-ink/60">Envío</dt><dd className="mt-1">{result.fee !== null ? <Price amount={result.fee} size="sm" className="[&_span:last-child]:!text-ink/60" /> : <span className="text-base font-semibold">Por confirmar</span>}</dd></div>
                  <div><dt className="text-ink/60">Tiempo</dt><dd className="mt-1 text-lg font-bold tabular-nums">{etaText(result.zone) ?? "—"}</dd></div>
                  {result.minOrder !== null && <div><dt className="text-ink/60">Mínimo</dt><dd className="mt-1"><Price amount={result.minOrder} size="sm" className="[&_span:last-child]:!text-ink/60" /></dd></div>}
                </dl>
                <LinkButton href="/menu/" size="lg" className="mt-5 w-full sm:w-auto">Empezar pedido</LinkButton>
              </div>
            )}
            {result.status === "outside" && (
              <div className="rounded-card border border-err/50 bg-err/10 p-5">
                <p className="flex items-center gap-2 text-[1.0625rem] font-semibold"><XCircle className="size-5 text-err" aria-hidden /> No entregamos en esa zona</p>
                {restaurant.ordering.pickupEnabled && <p className="mt-2 text-ink/75">Puedes elegir recogida en el restaurante al hacer tu pedido.</p>}
              </div>
            )}
            {result.status === "unknown" && <p className="flex items-center gap-2 text-ink/65"><MapPin className="size-5" aria-hidden /> Elige tu zona para ver costo, tiempo y pedido mínimo.</p>}
          </div>

          </div>
          <aside className="col-span-12 flex flex-col gap-1 self-end text-ink lg:col-span-4 lg:col-start-9" aria-label="Más información de entrega">
            <button type="button" onClick={() => setZonesOpen(true)} className={`${linkClass} justify-start`}>Ver todas las zonas y tarifas</button>
            {today && (
              <span className="py-2 text-[0.9375rem] text-ink/70">Hoy: {today} · <button type="button" onClick={() => setHoursOpen(true)} className="font-medium underline underline-offset-4">Ver horarios</button></span>
            )}
            {faq && <Link href="/preguntas-frecuentes/" className={`${linkClass} justify-start`}>¿Tienes dudas sobre la entrega?</Link>}
          </aside>
        </div>
      </Container>

      <Dialog open={zonesOpen} onClose={() => setZonesOpen(false)} title="Zonas y tarifas">
        <ul className="divide-y divide-line p-5">
          {zones.map((z) => (
            <li key={z.id} className="flex items-center justify-between gap-4 py-3.5">
              <span>{z.name}{etaText(z) && <span className="block text-sm text-cream2">{etaText(z)}</span>}</span>
              {z.fee !== null ? <Price amount={z.fee} size="sm" /> : <span className="text-sm text-cream2">Por confirmar</span>}
            </li>
          ))}
        </ul>
      </Dialog>
      <Dialog open={hoursOpen} onClose={() => setHoursOpen(false)} title="Horarios">
        <dl className="space-y-2 p-5">
          {hoursSummary().map((h) => (
            <div key={h.day} className="flex justify-between gap-4"><dt className="text-cream2">{h.day}</dt><dd className="tabular-nums">{h.text}</dd></div>
          ))}
        </dl>
      </Dialog>
    </Section>
  );
}
