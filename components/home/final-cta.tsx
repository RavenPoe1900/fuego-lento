"use client";

import { Button, LinkButton } from "@/components/shared/button";
import { Container } from "@/components/shared/layout";
import { content } from "@/config/content";
import { restaurant } from "@/config/restaurant";
import { useStoreStatus } from "@/lib/use-store-status";
import { useUi } from "@/store/ui-store";

/**
 * Bloque de contraste terracota solo sin servicio: invitación breve a seguir las novedades de la reapertura.
 */
export function FinalCta() {
  const sf = useStoreStatus();
  const setReopeningOpen = useUi((s) => s.setReopeningOpen);

  if (sf.orderingEnabled) return null;

  const c = content.finalCta.closed;
  return (
    <section className="relative overflow-hidden bg-terra py-16 text-center lg:py-20" aria-labelledby="cta-final">
      <div className="ember-glow absolute inset-0" aria-hidden />
      <Container className="relative">
        <h2 id="cta-final" className="mx-auto max-w-3xl t-h2">{c.title}</h2>
        <p className="lead mx-auto mt-4 max-w-xl text-cream/85">{c.description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <LinkButton href={restaurant.instagram.url} external size="lg">{c.cta}</LinkButton>
          {sf.signupEnabled && <Button variant="secondary" size="lg" onClick={() => setReopeningOpen(true)}>{content.hero.closed.signupCta}</Button>}
        </div>
      </Container>
    </section>
  );
}
