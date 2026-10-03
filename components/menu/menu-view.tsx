"use client";

import { Popover } from "radix-ui";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, LinkButton } from "@/components/shared/button";
import { Container } from "@/components/shared/layout";
import { Dialog } from "@/components/shared/modal";
import { EmptyState, ErrorState, ProductGridSkeleton } from "@/components/shared/state-panels";
import { content } from "@/config/content";
import { restaurant } from "@/config/restaurant";
import { track } from "@/lib/analytics";
import { getAllProducts, getVisibleCategories } from "@/lib/catalog";
import { normalizeSearch } from "@/lib/text";
import { useStoreStatus } from "@/lib/use-store-status";
import type { Product, ProductTag } from "@/types/product";
import { ProductCard } from "./product-card";

const TAG_FILTERS: { tag: ProductTag; label: string }[] = [
  { tag: "picante", label: "Picante" },
  { tag: "vegetariano", label: "Vegetariano" },
  { tag: "para-compartir", label: "Para compartir" },
  { tag: "nuevo", label: "Nuevo" },
];

type Sort = "featured" | "price-asc" | "price-desc";

function matches(p: Product, q: string, catName: string) {
  if (!q) return true;
  const hay = normalizeSearch([p.name, p.shortDescription, p.description, catName, ...p.ingredients, ...p.tags].join(" "));
  return q.split(/\s+/).every((word) => hay.includes(word));
}

const chip = (on: boolean) =>
  `min-h-11 shrink-0 rounded-full border px-5 text-[0.9375rem] font-semibold transition-colors ${
    on ? "border-ember bg-ember text-cream" : "border-transparent bg-white/[0.06] text-cream2 hover:bg-white/[0.1] hover:text-cream"
  }`;

export function MenuView() {
  const sf = useStoreStatus();
  const categories = useMemo(() => getVisibleCategories(), []);
  const products = useMemo(() => getAllProducts(), []);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [sort, setSort] = useState<Sort>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const chipsRef = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    track("view_menu");
    const wanted = new URLSearchParams(window.location.search).get("categoria");
    // Lectura única de la URL tras el montaje (la página es estática).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (wanted && categories.some((c) => c.slug === wanted)) setCat(wanted);
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, [categories]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { rootMargin: "-80px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [sf.showMenu]);

  useEffect(() => {
    chipsRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]')?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [cat]);

  const q = normalizeSearch(query);
  const activeTags = TAG_FILTERS.filter((f) => products.some((p) => p.tags.includes(f.tag)));
  const filtering = q !== "" || cat !== "all" || tags.length > 0;
  const currentCat = categories.find((c) => c.slug === cat);

  const results = useMemo(() => {
    let list = products.filter((p) => {
      const c = categories.find((x) => x.id === p.categoryId);
      if (cat !== "all" && c?.slug !== cat) return false;
      if (tags.length && !tags.every((t) => p.tags.includes(t))) return false;
      return matches(p, q, c?.name ?? "");
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.basePrice - b.basePrice);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.basePrice - a.basePrice);
    return list;
  }, [products, categories, cat, tags, q, sort]);

  const clear = () => {
    setQuery("");
    setCat("all");
    setTags([]);
    setSort("featured");
  };

  // Sin menú aprobado no se muestran productos, nombres ni precios
  if (!sf.showMenu)
    return (
      <Container className="py-20 lg:py-28">
        <EmptyState title={content.menu.unavailableTitle} text={content.menu.unavailableText}>
          <LinkButton href={restaurant.instagram.url} external>Seguir en Instagram</LinkButton>
        </EmptyState>
      </Container>
    );

  const sortSelect = (
    <label className="flex items-center gap-3 text-[0.9375rem] text-cream2">
      <span className="shrink-0 font-medium">Ordenar</span>
      <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-[52px] flex-1 rounded-ui border border-line bg-surface2 px-4 text-base text-cream focus:border-fire focus:outline-none focus:ring-2 focus:ring-fire/40">
        <option value="featured">Destacados</option>
        <option value="price-asc">Precio: menor a mayor</option>
        <option value="price-desc">Precio: mayor a menor</option>
      </select>
    </label>
  );

  const tagChips = (
    <div role="group" aria-label="Tipo de plato" className="flex flex-wrap gap-2">
      {activeTags.map((f) => {
        const on = tags.includes(f.tag);
        return (
          <button key={f.tag} type="button" aria-pressed={on} onClick={() => setTags((t) => (on ? t.filter((x) => x !== f.tag) : [...t, f.tag]))} className={chip(on)}>
            {f.label}
          </button>
        );
      })}
    </div>
  );

  const filtersLabel = `Filtros${tags.length ? ` (${tags.length})` : ""}`;
  const filterButton = (
    <Button variant="secondary" size="md" className="min-h-[52px]" aria-label={filtersLabel}>
      <SlidersHorizontal className="size-[18px]" aria-hidden />
      <span className="max-sm:sr-only">{filtersLabel}</span>
      {tags.length > 0 && <span className="rounded-full bg-ember px-2 text-xs font-bold leading-5 sm:hidden">{tags.length}</span>}
    </Button>
  );

  return (
    <div>
      <section className="bg-warm pb-8 pt-10 lg:pb-10 lg:pt-14">
        <Container>
          <h1 className="t-h2">{content.menu.title}</h1>
          <p className="lead mt-3 max-w-xl text-cream2">{content.menu.description}</p>
        </Container>
      </section>

      {/* Fila 1: búsqueda, orden y filtros */}
      <div className="bg-carbon">
        <Container className="py-5">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
              <input
                type="search"
                aria-label="Buscar en el menú"
                placeholder="Buscar plato, ingrediente…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[52px] w-full rounded-ui border border-white/[0.08] bg-white/[0.04] pl-12 pr-4 text-base placeholder:text-muted focus:border-fire focus:outline-none focus:ring-2 focus:ring-fire/40"
              />
            </div>
            <div className="hidden w-72 lg:block">{sortSelect}</div>
            {activeTags.length > 0 && (
              <>
                {/* Escritorio: popover */}
                <div className="hidden lg:block">
                  <Popover.Root>
                    <Popover.Trigger asChild>{filterButton}</Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content align="end" sideOffset={8} className="z-[60] w-72 rounded-card border border-line bg-surface2 p-5 shadow-[var(--shadow)]">
                        <p className="mb-3 font-semibold">Tipo de plato</p>
                        {tagChips}
                        {tags.length > 0 && <button type="button" onClick={() => setTags([])} className="mt-4 text-sm text-cream2 underline underline-offset-4">Limpiar filtros</button>}
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>
              </>
            )}
            {/* Móvil/tablet: hoja con orden y filtros */}
            <div className="lg:hidden" onClick={() => setFiltersOpen(true)} role="presentation">
              {filterButton}
            </div>
          </div>
        </Container>
      </div>

      <div ref={sentinel} aria-hidden className="h-px" />

      {/* Fila 2: categorías, pegadas bajo el header (top = altura real) */}
      <div className={`sticky top-[var(--header-height)] z-30 h-[var(--chips-height)] bg-carbon/95 backdrop-blur-md transition-[box-shadow,top] duration-200 ${stuck ? "shadow-[0_10px_24px_rgba(0,0,0,0.45)]" : ""}`}>
        <Container className="flex h-full items-center">
          <div ref={chipsRef} role="group" aria-label="Categorías" className="no-scrollbar flex w-full gap-2 overflow-x-auto">
            {[{ id: "all", slug: "all", name: "Todo" }, ...categories].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={cat === c.slug}
                onClick={() => {
                  setCat(c.slug);
                  if (c.slug !== "all") track("view_category", { category: c.slug });
                }}
                className={chip(cat === c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Container className="scroll-mt-40 py-10 lg:py-12">
        {!sf.orderingEnabled && <p role="note" className="mb-6 rounded-ui bg-white/[0.05] px-4 py-3 text-[0.9375rem] text-cream2">{content.menu.catalogNote}</p>}

        <div className="mb-7 flex items-baseline justify-between gap-4" role="status" aria-live="polite">
          {currentCat ? <h2 className="t-h3">{currentCat.name}</h2> : <span />}
          <p className="text-[0.9375rem] text-cream2">{ready ? `${results.length} ${results.length === 1 ? "resultado" : "resultados"}` : "Cargando menú…"}</p>
        </div>

        {!ready ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <ErrorState title="No pudimos cargar el menú" text="Revisa tu conexión e inténtalo de nuevo.">
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </ErrorState>
        ) : results.length === 0 ? (
          <EmptyState title="Sin resultados" text={content.menu.noResults}>
            <Button variant="secondary" onClick={clear}><X className="size-4" aria-hidden /> Limpiar filtros</Button>
          </EmptyState>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {results.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        )}
        {filtering && ready && results.length > 0 && <p className="mt-8 text-center"><button type="button" onClick={clear} className="min-h-11 text-[0.9375rem] text-cream2 underline underline-offset-4 hover:text-cream">Quitar filtros</button></p>}
      </Container>

      <Dialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filtros"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" size="lg" onClick={() => { setTags([]); setSort("featured"); }}>Limpiar</Button>
            <Button size="lg" className="flex-1" onClick={() => setFiltersOpen(false)}>Ver {results.length} {results.length === 1 ? "resultado" : "resultados"}</Button>
          </div>
        }
      >
        <div className="space-y-8 p-5">
          {sortSelect}
          {activeTags.length > 0 && (<div><p className="mb-3 font-semibold">Tipo de plato</p>{tagChips}</div>)}
        </div>
      </Dialog>
    </div>
  );
}
