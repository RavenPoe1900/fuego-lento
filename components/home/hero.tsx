"use client";

import Image from "next/image";
import { Button, LinkButton } from "@/components/shared/button";
import { content } from "@/config/content";
import { restaurant } from "@/config/restaurant";
import { deliveryZones } from "@/data/delivery-zones";
import { useStoreStatus } from "@/lib/use-store-status";
import { useUi } from "@/store/ui-store";

/** Un mensaje, una acción principal. Los datos operativos solo aparecen si están confirmados y el servicio está activo. */
export function Hero() {
  const sf = useStoreStatus();
  const setReopeningOpen = useUi((s) => s.setReopeningOpen);
  const ordering = sf.orderingEnabled;
  const c = ordering ? content.hero : content.hero.closed;
  const etas = deliveryZones.filter((z) => z.available && z.etaMinutes).flatMap((z) => z.etaMinutes!);
  const statusLine = ordering
    ? [sf.openNow ? "Abierto ahora" : sf.next ? `Abrimos ${sf.next.toLowerCase()}` : "Cerrado ahora", sf.showDelivery && etas.length ? `Entrega estimada ${Math.min(...etas)}–${Math.max(...etas)} min` : null].filter(Boolean).join(" · ")
    : null;

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <Image src={content.hero.image.src} alt={content.hero.image.alt} fill priority sizes="100vw" className="food-image -z-20 object-cover object-[68%_center] md:object-center" />
      {/* Overlay concentrado detrás del texto */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,8,6,0.94)_0%,rgba(10,8,6,0.72)_34%,rgba(10,8,6,0.18)_66%,rgba(10,8,6,0.05)_100%),linear-gradient(0deg,rgba(10,8,6,0.75)_0%,transparent_36%)] max-md:bg-[linear-gradient(180deg,rgba(10,8,6,0.5)_0%,rgba(10,8,6,0.85)_55%,rgba(10,8,6,0.97)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-carbon to-transparent" />

      <div className="container-x flex min-h-[560px] flex-col justify-center py-16 md:min-h-[min(820px,calc(100svh-var(--header-height)))] lg:min-h-[760px] md:py-24">
        <div className="editorial-grid"><div className="col-span-12 max-w-[560px] lg:col-span-6">
          <p className="eyebrow anim-rise mb-5">{content.hero.eyebrow}</p>
          {!ordering && sf.message && (
            <p className="anim-rise mb-5 inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-2 text-[0.9375rem] font-semibold backdrop-blur" style={{ animationDelay: "40ms" }}>
              <span className={`size-2 rounded-full ${sf.tone === "gold" ? "bg-gold" : "bg-err"}`} aria-hidden /> {sf.message}
            </p>
          )}
          <h1 id="hero-title" className="t-display anim-rise" style={{ animationDelay: "60ms" }}>
            {c.title}
          </h1>
          <p className="lead anim-rise mt-6 max-w-[34rem] text-balance text-cream/90" style={{ animationDelay: "120ms" }}>{c.description}</p>

          <div className="anim-rise mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center" style={{ animationDelay: "180ms" }}>
            {ordering ? (
              <>
                <LinkButton href="#menu" size="lg">{content.hero.primaryCta}</LinkButton>
                {sf.showDelivery && (
                  <a href="#cobertura" className="py-3 text-[0.9375rem] font-medium text-cream underline underline-offset-4 hover:text-fire">{content.hero.coverageLink}</a>
                )}
              </>
            ) : (
              <>
                {sf.showMenu && <LinkButton href="#menu" size="lg">{content.hero.closed.exploreCta}</LinkButton>}
                {sf.signupEnabled && <Button size="lg" onClick={() => setReopeningOpen(true)}>{content.hero.closed.signupCta}</Button>}
                <LinkButton href={restaurant.instagram.url} external variant={sf.showMenu || sf.signupEnabled ? "secondary" : "primary"} size="lg">{content.hero.closed.instagramCta}</LinkButton>
              </>
            )}
          </div>

          {statusLine && <p className="anim-rise mt-8 text-[0.9375rem] text-cream2" style={{ animationDelay: "240ms" }}>{statusLine}</p>}
        </div></div>
      </div>
    </section>
  );
}
