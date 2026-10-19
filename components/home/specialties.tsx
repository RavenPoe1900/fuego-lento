"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { Container, Section } from "@/components/shared/layout";
import { Price } from "@/components/shared/price";
import { content } from "@/config/content";
import { baseName, getAllProducts } from "@/lib/catalog";
import { useStoreStatus } from "@/lib/use-store-status";
import { useUi } from "@/store/ui-store";

/**
 * Especialidades de la parrilla: lista editorial de filas amplias, cada una abre su ficha.
 * Es una selección de la carta (cortes con foto que no están ya en la selección de la casa), sin ranking ni numeración.
 */
export function Specialties() {
  const { showPrices } = useStoreStatus();
  const openProduct = useUi((s) => s.openProduct);
  // Cortes a la parrilla con foto, sin repetir los destacados ni el mismo corte en otro peso
  const items = useMemo(() => {
    const seen = new Set<string>();
    return getAllProducts()
      .filter((p) => p.available && p.images[0] && p.categoryId === "carnes-parrilla" && !p.featured)
      .filter((p) => {
        const base = baseName(p);
        if (seen.has(base)) return false;
        seen.add(base);
        return true;
      })
      .slice(0, 4);
  }, []);
  if (items.length < 3) return null;
  const s = content.specialties;

  return (
    <Section id="especialidades" tone="soft" labelledBy="especialidades-t" pad={false} className="py-16 lg:py-24">
      <Container>
        <div className="editorial-grid gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow mb-4">{s.eyebrow}</p>
            <h2 id="especialidades-t" className="t-h2">{s.title}</h2>
            <p className="lead mt-3 max-w-md text-cream2">{s.description}</p>
          </div>

          <ul className="col-span-12 divide-y divide-line border-y border-line lg:col-span-8">
            {items.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => openProduct(p.id)}
                  className="group grid w-full grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-4 py-5 text-left sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:gap-6"
                  aria-label={`Ver ficha de ${p.name}`}
                >
                  <span className="relative block aspect-square overflow-hidden rounded-ui bg-surface2">
                    <Image src={p.images[0].src} alt="" fill sizes="96px" className="food-image object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[1.5rem] leading-tight transition-colors group-hover:text-accent sm:text-[1.875rem]">{baseName(p)}</span>
                    {p.size && <span className="mt-0.5 block text-[0.875rem] text-muted">{p.size}</span>}
                    <span className="mt-1 hidden text-[0.9375rem] leading-snug text-cream2 sm:block">{p.shortDescription}</span>
                  </span>
                  <span className="flex flex-col items-end gap-1.5">
                    {showPrices && <Price amount={p.basePrice} size="md" />}
                    <span className="inline-flex items-center gap-0.5 text-[0.8125rem] font-semibold text-cream2 group-hover:text-cream">
                      Ver ficha <ChevronRight className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
