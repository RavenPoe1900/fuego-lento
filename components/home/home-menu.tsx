"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/menu/product-card";
import { LinkButton } from "@/components/shared/button";
import { chipClass as chip } from "@/components/shared/chip";
import { Container, Section } from "@/components/shared/layout";
import { content } from "@/config/content";
import { getAllProducts, getFeaturedProducts, getVisibleCategoryGroups, groupCategoryIds } from "@/lib/catalog";
import { useStoreStatus } from "@/lib/use-store-status";


/** Menú dentro de la portada: cuadrícula funcional con selector de familia. Compra o consulta según el estado del servicio. */
export function HomeMenu() {
  const { orderingEnabled } = useStoreStatus();
  const cats = useMemo(() => getVisibleCategoryGroups(), []);
  const [tab, setTab] = useState("favoritos");
  const items = useMemo(() => {
    const all = getAllProducts();
    if (tab === "favoritos") {
      const fav = getFeaturedProducts();
      return [...fav, ...all.filter((p) => p.available && !fav.includes(p) )].slice(0, 6);
    }
    const group = cats.find((g) => g.id === tab);
    return all.filter((p) => group && groupCategoryIds(group).includes(p.categoryId)).slice(0, 6);
  }, [tab, cats]);

  return (
    <Section id="menu" tone="raised" labelledBy="menu-t" pad={false} className="py-16 lg:py-24">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-6 lg:mb-10 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">Menú</p>
            <h2 id="menu-t" className="t-h2">{content.menu.title}</h2>
            <p className="lead mt-3 text-cream2">{orderingEnabled ? content.menu.description : content.menu.catalogNote}</p>
          </div>
          <LinkButton href={`/menu/${tab !== "favoritos" ? `?categoria=${cats.find((c) => c.id === tab)?.slug}` : ""}`} variant="link" size="sm" className="self-start">Ver menú completo →</LinkButton>
        </div>

        <div role="group" aria-label="Familia de platos" className="no-scrollbar -mx-4 mb-7 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {[{ id: "favoritos", name: "Favoritos" }, ...cats].map((c) => (
            <button key={c.id} type="button" aria-pressed={tab === c.id} onClick={() => setTab(c.id)} className={chip(tab === c.id)}>{c.name}</button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 max-sm:[&>*:nth-child(n+5)]:hidden">
          {items.map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
      </Container>
    </Section>
  );
}
