"use client";

import { ChevronDown } from "lucide-react";
import { Container } from "@/components/shared/layout";
import { EmptyState } from "@/components/shared/state-panels";
import { LinkButton } from "@/components/shared/button";
import { content } from "@/config/content";
import { getFaq } from "@/data/faq";
import { useStoreStatus } from "@/lib/use-store-status";
import type { FaqItem } from "@/types/restaurant";

/** Acordeón nativo: accesible por teclado y exclusivo (una respuesta abierta a la vez). */
function Accordion({ items, name }: { items: FaqItem[]; name: string }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.id} name={name} className="group">
          <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.0625rem] font-semibold [&::-webkit-details-marker]:hidden">
            <span>{f.question}</span>
            <ChevronDown className="size-5 shrink-0 text-accent transition-transform duration-200 group-open:rotate-180" aria-hidden />
          </summary>
          <p className="max-w-2xl pb-6 pr-8 text-base leading-relaxed text-cream2">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqPage() {
  const sf = useStoreStatus();
  const items = getFaq(sf);
  const packaging = content.packaging.items.filter((i) => i.answer !== null);
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
          <div className="mt-10 space-y-12">
            <Accordion items={items} name="faq" />
            {packaging.length > 0 && (
              <div>
                <h2 className="h-sub mb-5">{content.packaging.title}</h2>
                <Accordion items={packaging} name="packaging" />
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
