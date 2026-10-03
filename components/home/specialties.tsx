"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Container, Section } from "@/components/shared/layout";
import { Price } from "@/components/shared/price";
import { content } from "@/config/content";
import { getAllProducts } from "@/lib/catalog";
import { useStoreStatus } from "@/lib/use-store-status";
import { useUi } from "@/store/ui-store";

/** Lista editorial numerada con vista previa que cambia: no es otra cuadrícula de tarjetas. */
export function Specialties() {
  const { showPrices } = useStoreStatus();
  const openProduct = useUi((s) => s.openProduct);
  const items = useMemo(() => getAllProducts().filter((p) => p.available && p.images[0] && (p.categoryId === "especialidades" || p.categoryId === "combos")).slice(0, 5), []);
  const [active, setActive] = useState(0);
  if (items.length < 3) return null;
  const s = content.specialties;

  return (
    <Section tone="soft" labelledBy="especialidades" pad={false} className="py-16 lg:py-24">
      <Container>
        <div className="editorial-grid gap-y-10">
          <div className="col-span-12 lg:col-span-6">
            <p className="eyebrow mb-4">{s.eyebrow}</p>
            <h2 id="especialidades" className="t-h2">{s.title}</h2>
            <p className="lead mt-3 max-w-lg text-cream2">{s.description}</p>
            <ol className="mt-10 divide-y divide-white/[0.07]">
              {items.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => openProduct(p.id)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex w-full items-center gap-5 py-5 text-left lg:gap-7 lg:py-6"
                    aria-label={`Ver ${p.name}`}
                  >
                    <span className={`w-9 shrink-0 font-display text-[1.375rem] tabular-nums transition-colors ${active === i ? "text-fire" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className={`block font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight transition-colors ${active === i ? "text-cream" : "text-cream2"}`}>{p.name}</span>
                      <span className="mt-1 block line-clamp-1 text-[0.9375rem] text-muted">{p.shortDescription}</span>
                    </span>
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-ui lg:hidden">
                      <Image src={p.images[0].src} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                    {showPrices && <Price amount={p.basePrice} size="sm" className="hidden sm:block" />}
                    <ArrowUpRight className="hidden size-5 shrink-0 text-cream2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 lg:block" aria-hidden />
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* Vista previa (solo escritorio): se cruza con fundido al cambiar de elemento */}
          <div className="relative hidden lg:col-span-5 lg:col-start-8 lg:block" aria-hidden>
            <div className="sticky top-[calc(var(--header-height)+32px)] aspect-[4/5] overflow-hidden rounded-[14px]">
              {items.map((p, i) => (
                <Image key={p.id} src={p.images[0].src} alt="" fill sizes="480px" className={`food-image object-cover transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0"}`} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
