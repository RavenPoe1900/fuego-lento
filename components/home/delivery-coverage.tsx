"use client";

import { ArrowLink } from "@/components/shared/arrow-link";
import { Button } from "@/components/shared/button";
import { Container, Section } from "@/components/shared/layout";
import { content } from "@/config/content";
import { restaurant } from "@/config/restaurant";
import { faqAvailable } from "@/data/faq";
import { hoursLine } from "@/lib/schedule";
import { useStoreStatus } from "@/lib/use-store-status";
import { useUi } from "@/store/ui-store";

const DOT = { ok: "bg-ok-light", gold: "bg-gold", err: "bg-err" } as const;

/**
 * Entrega y recogida con datos reales: se puede recibir en casa o recoger en el local; el coste del envío,
 * la cobertura y el pago se confirman por WhatsApp. No hay zonas, tarifas ni tiempos publicados.
 * Sin pedidos activos, el bloque solo informa del estado.
 */
export function DeliveryCoverage() {
  const sf = useStoreStatus();
  const setReopeningOpen = useUi((s) => s.setReopeningOpen);
  const faq = faqAvailable(sf);
  const d = content.delivery;
  const address = [restaurant.address, restaurant.city].filter(Boolean).join(", ");
  const hours = sf.showHours ? hoursLine() : null;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name}, ${address}`)}`;

  const blocks = sf.orderingEnabled
    ? [
        sf.deliveryEnabled && { title: d.homeTitle, text: d.homeText },
        sf.pickupEnabled && { title: d.pickupTitle, text: d.pickupText, extra: "address" as const },
        { title: d.paymentTitle, text: d.paymentText },
      ].filter(Boolean) as { title: string; text: string; extra?: "address" }[]
    : [];

  return (
    <Section id="entrega" tone="paper" labelledBy="entrega-t" pad={false} className="py-16 lg:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">{d.eyebrow}</p>
          <h2 id="entrega-t" className="t-h2">{d.title}</h2>
          <p className="lead mt-3 text-ink/75">{sf.orderingEnabled ? d.description : d.closedText}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-2 text-[0.9375rem] font-semibold" role="status">
            <span className={`size-2 shrink-0 rounded-full ${sf.ready ? DOT[sf.tone] : "bg-ink/30"}`} aria-hidden />
            {sf.ready ? sf.label : "…"}
            {hours && <span className="font-normal text-ink/70">· {hours}</span>}
          </p>
          {sf.ready && sf.closedNote && <p className="mt-2 text-[0.9375rem] text-ink/75">{sf.closedNote}</p>}
        </div>

        {blocks.length > 0 && (
          <dl className="mt-10 grid gap-8 border-t border-ink/20 pt-8 md:grid-cols-3 md:gap-10">
            {blocks.map((b) => (
              <div key={b.title}>
                <dt className="text-[1.0625rem] font-semibold">{b.title}</dt>
                <dd className="mt-2 max-w-[38ch] text-[0.9375rem] leading-relaxed text-ink/75">
                  {b.text}
                  {b.extra === "address" && address && (
                    <>
                      {" "}
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline underline-offset-4">
                        {address}<span className="sr-only"> (se abre en una pestaña nueva)</span>
                      </a>
                      .
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {(sf.signupEnabled || faq) && (
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            {sf.signupEnabled && <Button size="lg" onClick={() => setReopeningOpen(true)}>{content.hero.closed.signupCta}</Button>}
            {faq && <ArrowLink href="/preguntas-frecuentes/" onLight caps={false}>¿Tienes dudas sobre la entrega?</ArrowLink>}
          </div>
        )}
      </Container>
    </Section>
  );
}
