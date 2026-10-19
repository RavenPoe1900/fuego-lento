"use client";

import { LinkButton } from "@/components/shared/button";
import { Accordion } from "@/components/shared/accordion";
import { Container } from "@/components/shared/layout";
import { EmptyState } from "@/components/shared/state-panels";
import { getFaq } from "@/data/faq";
import { useStoreStatus } from "@/lib/use-store-status";

export function FaqPage() {
  const sf = useStoreStatus();
  const items = getFaq(sf);
  return (
    <Container size="narrow" className="py-14 lg:py-20">
      <div className="mx-auto max-w-[960px]">
        <p className="eyebrow mb-4">Ayuda</p>
        <h1 className="h-section">Preguntas frecuentes</h1>
        {items.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="Aún no hay preguntas publicadas" text="Publicaremos aquí las respuestas cuando el servicio esté disponible.">
              <LinkButton href="/" variant="secondary">Volver al inicio</LinkButton>
            </EmptyState>
          </div>
        ) : (
          <div className="mt-10">
            <Accordion items={items} name="faq" />
          </div>
        )}
      </div>
    </Container>
  );
}
