"use client";

import { Check, ChevronRight, Plus, SlidersHorizontal } from "lucide-react";
import { useEffect } from "react";
import { ProductTags } from "@/components/menu/product-labels";
import { useProductAction } from "@/components/menu/use-product-action";
import { Badge } from "@/components/shared/badge";
import { Button, LinkButton } from "@/components/shared/button";
import { chipClass } from "@/components/shared/chip";
import { Container } from "@/components/shared/layout";
import { Price } from "@/components/shared/price";
import { EmptyState } from "@/components/shared/state-panels";
import { content } from "@/config/content";
import { restaurant } from "@/config/restaurant";
import { track } from "@/lib/analytics";
import { getMeatCategories, getMeatProducts } from "@/lib/catalog";
import { formatUsd } from "@/lib/currency";
import { useStoreStatus } from "@/lib/use-store-status";
import type { Product } from "@/types/product";

const CATEGORY_BLURB: Record<string, string> = {
  steaks: "precio por pieza",
  cortes: "porcionados en Fuego Lento",
  embutidos: "precio por paquete",
};

/** Botón de acción de una fila o un combo: añadir, elegir opciones (peso) o ver detalle según el estado. */
function ProductAction({ product }: { product: Product }) {
  const { soldOut, canBuy, needsChoice, added, open, quickAdd } = useProductAction(product);
  const cls = "sm:min-w-[11.5rem]";
  if (soldOut || !canBuy)
    return (
      <Button variant="soft" size="sm" onClick={open} aria-label={`Ver detalle de ${product.name}`} className={cls}>
        Ver detalle <ChevronRight className="size-4 sm:hidden" aria-hidden />
      </Button>
    );
  if (needsChoice)
    return (
      <Button variant="soft" size="sm" onClick={open} aria-label={`Elegir peso de ${product.name}`} className={cls}>
        <SlidersHorizontal className="size-4" aria-hidden /> Elegir peso
      </Button>
    );
  return (
    <Button variant="soft" size="sm" onClick={quickAdd} aria-label={`Añadir ${product.name} al pedido`} className={`${cls} ${added ? "!border-ok/60 !bg-ok/15 !text-ok-soft" : ""}`}>
      {added ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
      {added ? "Añadido" : "Añadir al pedido"}
    </Button>
  );
}

/** Fila de la lista de precios: nombre, medida, precio y acción. */
function MeatRow({ product }: { product: Product }) {
  const { showPrice, open } = useProductAction(product);
  return (
    <li className="grid gap-x-6 gap-y-3 border-b border-dashed border-line py-5 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_9.5rem_11.5rem] sm:items-center">
      <div className="min-w-0">
        <h3 className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-sans text-[1.0625rem] font-semibold leading-tight">
          <button type="button" onClick={open} className="text-left hover:text-accent focus-visible:text-accent">{product.name}</button>
          <span className="flex gap-1.5"><ProductTags product={{ ...product, tags: [] }} /></span>
        </h3>
        {product.priceNote && <p className="mt-1 text-[0.8125rem] text-muted">{product.priceNote}</p>}
      </div>
      <p className="text-[0.9375rem] text-cream2">{product.size}</p>
      {showPrice ? <Price amount={product.basePrice} currency="USD" dual size="md" className="sm:text-right" /> : <span />}
      <ProductAction product={product} />
    </li>
  );
}

/** Tarjeta de combo: contenido, precio normal tachado, ahorro y precio final. */
function ComboCard({ product }: { product: Product }) {
  const { showPrice } = useProductAction(product);
  const saving = product.compareAtPrice ? product.compareAtPrice - product.basePrice : 0;
  return (
    <li className="flex flex-col rounded-card border border-line bg-surface p-6">
      <h4 className="font-display text-[1.5rem] leading-tight">{product.name}</h4>
      <p className="mt-1 text-[0.9375rem] italic text-gold-soft">{product.shortDescription}</p>
      <ul className="mt-4 space-y-1.5 text-[0.9375rem] text-cream2">
        {product.includes?.map((i) => (
          <li key={i} className="flex gap-2"><span aria-hidden className="text-accent">▸</span>{i}</li>
        ))}
      </ul>
      {product.priceNote && <p className="mt-3 text-[0.8125rem] text-muted">{product.priceNote}</p>}
      <div className="mt-auto border-t border-line pt-5">
        {showPrice && (
          <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
            <div className="flex flex-wrap items-center gap-3">
              {product.compareAtPrice && <s className="font-mono text-[0.9375rem] tabular-nums text-muted">{formatUsd(product.compareAtPrice, false)}</s>}
              {saving > 0 && <Badge tone="gold">Ahorra {formatUsd(saving, false)}</Badge>}
            </div>
            <Price amount={product.basePrice} currency="USD" dual size="lg" className="text-right" />
          </div>
        )}
        <ProductAction product={product} />
      </div>
    </li>
  );
}

export function CarnesView() {
  const sf = useStoreStatus();
  const meat = content.meat;
  const categories = getMeatCategories();

  useEffect(() => {
    track("view_meat");
  }, []);

  // Sin menú aprobado no se muestran productos, nombres ni precios
  if (!sf.showMenu)
    return (
      <Container className="py-20 lg:py-28">
        <EmptyState title={content.menu.unavailableTitle} text={content.menu.unavailableText}>
          <LinkButton href={restaurant.instagram.url} external>Seguir en Instagram</LinkButton>
        </EmptyState>
      </Container>
    );

  return (
    <div>
      <section className="bg-warm pb-8 pt-10 lg:pb-10 lg:pt-14">
        <Container>
          <p className="eyebrow mb-4">{meat.eyebrow}</p>
          <h1 className="t-h2 font-light">{meat.page.title}</h1>
          <p className="lead mt-3 max-w-xl text-cream2">{meat.page.description}</p>
          <nav aria-label="Secciones de carnes" className="no-scrollbar -mx-4 mt-6 flex gap-x-7 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {categories.map((c) => (
              <a key={c.id} href={`#${c.id}`} className={chipClass(false)}>{c.name}</a>
            ))}
          </nav>
        </Container>
      </section>

      <Container className="space-y-14 py-12 lg:space-y-20 lg:py-16">
        {categories.filter((c) => c.id !== "combos").map((c) => (
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-t`}>
            <div className="mb-2 flex flex-wrap items-baseline gap-x-4 border-b border-line pb-3">
              <h2 id={`${c.id}-t`} className="font-display text-[2rem] leading-none text-accent">{c.name}</h2>
              <p className="text-[0.9375rem] text-muted">{CATEGORY_BLURB[c.id]}</p>
            </div>
            <ul>
              {getMeatProducts(c.id).map((p) => (<MeatRow key={p.id} product={p} />))}
            </ul>
          </section>
        ))}

        <section id="combos" aria-labelledby="combos-t">
          <div className="mb-8 border-b border-line pb-3">
            <h2 id="combos-t" className="font-display text-[2rem] leading-none text-accent">{meat.page.combosTitle}</h2>
            <p className="mt-2 text-[0.9375rem] text-muted">{meat.page.combosDescription}</p>
          </div>
          {([2, 4] as const).map((n) => (
            <div key={n} className="mb-10 last:mb-0">
              <h3 className="mb-5 flex items-center gap-3 font-display text-[1.5rem]">
                <span className="rounded-full bg-accent px-4 py-1.5 font-mono text-[0.75rem] font-medium uppercase tracking-[0.16em] text-carbon">Para {n}</span>
                {meat.page.groups[n]}
              </h3>
              <ul className="grid gap-4 md:grid-cols-2">
                {getMeatProducts("combos").filter((p) => p.serves === n).map((p) => (<ComboCard key={p.id} product={p} />))}
              </ul>
            </div>
          ))}
        </section>

        <p className="max-w-3xl text-[0.875rem] leading-relaxed text-muted">{meat.page.note}</p>
      </Container>
    </div>
  );
}
