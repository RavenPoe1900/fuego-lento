"use client";

import { Container, Section } from "@/components/shared/layout";
import { content } from "@/config/content";
import { useStoreStatus } from "@/lib/use-store-status";

/** Texto editorial con mucho aire. Describe la oferta; no afirma historia ni trayectoria. */
export function Manifesto() {
  const { orderingEnabled } = useStoreStatus();
  const m = content.manifesto;
  return (
    <Section tone="base" pad={false} labelledBy="manifiesto" className="py-24 lg:py-36">
      <Container>
        <div className="editorial-grid gap-y-8">
          <p className="eyebrow col-span-12 lg:col-span-3 lg:pt-5">{m.label}</p>
          <div className="col-span-12 lg:col-span-9">
            <h2 id="manifiesto" className="t-h1">{m.title}</h2>
            <p className="mt-8 max-w-[55ch] font-display text-[clamp(1.5rem,2.4vw,2.25rem)] leading-snug text-cream2">
              {m.text}{orderingEnabled ? m.textOrdering : "."}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
