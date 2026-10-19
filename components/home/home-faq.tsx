"use client";

import { ArrowLink } from "@/components/shared/arrow-link";
import { Accordion } from "@/components/shared/accordion";
import { Container, Section } from "@/components/shared/layout";
import { faqAvailable, getFaq } from "@/data/faq";
import { useStoreStatus } from "@/lib/use-store-status";

/** Las primeras preguntas de la portada; el resto vive en /preguntas-frecuentes. */
export function HomeFaq() {
  const sf = useStoreStatus();
  if (!faqAvailable(sf)) return null;
  const items = getFaq(sf).slice(0, 4);
  return (
    <Section id="preguntas" tone="base" labelledBy="preguntas-t" pad={false} className="py-16 lg:py-24">
      <Container>
        <div className="editorial-grid gap-y-8">
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow mb-4">Ayuda</p>
            <h2 id="preguntas-t" className="t-h2">Preguntas frecuentes</h2>
            <p className="mt-6"><ArrowLink href="/preguntas-frecuentes/">Ver todas</ArrowLink></p>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <Accordion items={items} name="home-faq" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
