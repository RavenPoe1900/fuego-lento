"use client";

import Image from "next/image";
import { Instagram } from "@/components/shared/icons";
import { Button, LinkButton } from "@/components/shared/button";
import { Container } from "@/components/shared/layout";
import { content } from "@/config/content";
import { restaurant } from "@/config/restaurant";
import { useStoreStatus } from "@/lib/use-store-status";
import { useUi } from "@/store/ui-store";

/**
 * Bloque de contraste terracota. Con servicio activo: comunidad (tres imágenes y enlace a Instagram).
 * Sin servicio: invitación breve a seguir las novedades de la reapertura.
 */
export function FinalCta() {
  const sf = useStoreStatus();
  const setReopeningOpen = useUi((s) => s.setReopeningOpen);

  if (sf.orderingEnabled)
    return (
      <section className="bg-terra py-16 lg:py-24" aria-labelledby="comunidad">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-4">Comunidad</p>
              <h2 id="comunidad" className="t-h2">{content.community.title}</h2>
              <p className="lead mt-4 text-cream/80">{content.community.description}</p>
              <LinkButton href={restaurant.instagram.url} external size="lg" className="mt-7">
                <Instagram className="size-5" /> {content.community.cta}
                <span className="sr-only">(se abre en una pestaña nueva)</span>
              </LinkButton>
              <p className="mt-3 text-[0.9375rem] text-cream2">{restaurant.instagram.handle}</p>
            </div>
            <ul className="grid grid-cols-3 gap-3 lg:col-span-7">
              {content.community.images.map((img) => (
                <li key={img.src} className="relative aspect-[3/4] overflow-hidden rounded-card">
                  <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 220px, 33vw" loading="lazy" className="food-image object-cover" />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    );

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
