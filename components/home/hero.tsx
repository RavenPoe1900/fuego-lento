"use client";

import Image from "next/image";
import { Button, LinkButton } from "@/components/shared/button";
import { content } from "@/config/content";
import { restaurant } from "@/config/restaurant";
import { useStoreStatus } from "@/lib/use-store-status";
import { useUi } from "@/store/ui-store";

const DOT = { ok: "bg-ok", gold: "bg-gold", err: "bg-err" } as const;

/**
 * Una marca, un título, dos caminos: platos preparados o carnes para cocinar.
 * El estado operativo sale de la misma fuente que el pie y los avisos (useStoreStatus), nunca de un texto fijo.
 */
export function Hero() {
  const sf = useStoreStatus();
  const setReopeningOpen = useUi((s) => s.setReopeningOpen);
  const ordering = sf.orderingEnabled;
  const c = ordering ? content.hero : content.hero.closed;
  const h = content.hero;
  const statusText = sf.ready ? [sf.label, !ordering ? sf.message : null].filter(Boolean).join(" · ") : null;
  const next = sf.ready && ordering && !sf.openNow && sf.next ? `Abrimos ${sf.next.toLowerCase()}` : null;

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <Image src={h.image.src} alt={h.image.alt} fill priority sizes="100vw" className="food-image -z-20 object-cover object-[68%_center] md:object-center" />
      {/* Overlay concentrado detrás del texto: el producto queda a la derecha */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,8,6,0.94)_0%,rgba(10,8,6,0.74)_38%,rgba(10,8,6,0.2)_70%,rgba(10,8,6,0.05)_100%),linear-gradient(0deg,rgba(10,8,6,0.7)_0%,transparent_30%)] max-md:bg-[linear-gradient(180deg,rgba(10,8,6,0.55)_0%,rgba(10,8,6,0.86)_55%,rgba(10,8,6,0.97)_100%)]" />

      <div className="container-x flex min-h-[520px] flex-col justify-center py-14 md:min-h-[580px] md:py-20 lg:min-h-[620px]">
        <div className="editorial-grid">
          <div className="col-span-12 max-w-[640px] lg:col-span-7">
            <p className="eyebrow anim-rise mb-5">{h.eyebrow}</p>
            <h1 id="hero-title" className="t-hero anim-rise text-balance" style={{ animationDelay: "60ms" }}>
              {c.title}
            </h1>
            <p className="lead anim-rise mt-5 max-w-[34rem] text-balance text-cream/90" style={{ animationDelay: "120ms" }}>{c.description}</p>

            <div className="anim-rise mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center" style={{ animationDelay: "180ms" }}>
              {sf.showMenu && <LinkButton href="#platos-preparados" size="lg">{ordering ? h.primaryCta : content.hero.closed.exploreCta}</LinkButton>}
              {sf.showMenu && (
                <LinkButton href="#carnes-para-cocinar" variant="secondary" size="lg">{ordering ? h.secondaryCta : content.hero.closed.meatCta}</LinkButton>
              )}
              {!ordering && sf.signupEnabled && <Button size="lg" onClick={() => setReopeningOpen(true)}>{content.hero.closed.signupCta}</Button>}
              {!ordering && <LinkButton href={restaurant.instagram.url} external variant={sf.showMenu ? "ghost" : "primary"} size="lg">{content.hero.closed.instagramCta}</LinkButton>}
            </div>

            {statusText && (
              <p className="anim-rise mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9375rem] text-cream2" style={{ animationDelay: "240ms" }} role="status">
                <span className={`size-2 shrink-0 rounded-full ${DOT[sf.tone]}`} aria-hidden />
                <span>{statusText}</span>
                {next && <span>· {next}</span>}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
