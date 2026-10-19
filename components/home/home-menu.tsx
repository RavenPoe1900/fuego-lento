"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/menu/product-card";
import { ArrowLink } from "@/components/shared/arrow-link";
import { chipClass as chip } from "@/components/shared/chip";
import { Container, Section } from "@/components/shared/layout";
import { EmptyState } from "@/components/shared/state-panels";
import { content } from "@/config/content";
import { getAllProducts, getFeaturedProducts, getVisibleCategoryGroups, groupCategoryIds } from "@/lib/catalog";
import { useStoreStatus } from "@/lib/use-store-status";

/** Cuántos platos enseña la portada por pestaña: el resto está en la carta completa. */
const SHOWN = 4;
const FEATURED_TAB = "seleccion";

/**
 * Platos preparados dentro de la portada: una selección corta con filtro por familia.
 * "Selección de la casa" es una elección fija del restaurante (no un ranking de ventas ni favoritos del usuario).
 */
export function HomeMenu() {
  const { orderingEnabled } = useStoreStatus();
  const cats = useMemo(() => getVisibleCategoryGroups(), []);
  const [tab, setTab] = useState(FEATURED_TAB);
  const items = useMemo(() => {
    if (tab === FEATURED_TAB) return getFeaturedProducts().filter((p) => p.available).slice(0, SHOWN);
    const group = cats.find((g) => g.id === tab);
    if (!group) return [];
    const ids = groupCategoryIds(group);
    return getAllProducts().filter((p) => ids.includes(p.categoryId)).slice(0, SHOWN);
  }, [tab, cats]);
  const m = content.menu;
  const current = cats.find((c) => c.id === tab);

  return (
    <Section id="platos-preparados" tone="raised" labelledBy="platos-t" pad={false} className="py-16 lg:py-24">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-6 lg:mb-10 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">{m.eyebrow}</p>
            <h2 id="platos-t" className="t-h2">{m.title}</h2>
            <p className="lead mt-3 text-cream2">{orderingEnabled ? m.description : m.catalogNote}</p>
          </div>
          <ArrowLink href={`/menu/${current ? `?categoria=${current.slug}` : ""}`} className="self-start">
            {current ? `Ver ${current.name.toLowerCase()}` : m.allCta}
          </ArrowLink>
        </div>

        <div role="group" aria-label="Categorías de platos preparados" className="no-scrollbar fade-x -mx-4 mb-7 flex gap-x-7 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {[{ id: FEATURED_TAB, name: m.featuredLabel }, ...cats].map((c) => (
            <button key={c.id} type="button" aria-pressed={tab === c.id} onClick={() => setTab(c.id)} className={chip(tab === c.id)}>{c.name}</button>
          ))}
        </div>

        {items.length === 0 ? (
          <EmptyState title="Sin platos por ahora" text={m.emptyCategory} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4 xl:gap-6">
            {items.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        )}
      </Container>
    </Section>
  );
}
