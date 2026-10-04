"use client";

import { chipClass as chip } from "@/components/shared/chip";
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
import { childCategoryIds, getAllProducts, getVisibleCategories, getVisibleCategoryGroups, groupCategoryIds } from "@/lib/catalog";
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


export function MenuView() {
  const sf = useStoreStatus();
  const categories = useMemo(() => getVisibleCategories(), []);
  const groups = useMemo(() => getVisibleCategoryGroups(), []);
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
    if (wanted && (categories.some((c) => c.slug === wanted) || groups.some((g) => g.slug === wanted || g.children.some((ch) => ch.sections && ch.id === wanted)))) setCat(wanted);
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, [categories, groups]);

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
  const groupOf = (categoryId: string) => groups.find((g) => groupCategoryIds(g).includes(categoryId));
  // Chip que reúne varias categorías (p. ej. Vinos) elegido directamente
  const combined = groups.flatMap((g) => g.children).find((ch) => ch.sections && ch.id === cat);
  // Grupo activo: el propio grupo elegido, el del chip combinado o el de la categoría elegida
  const activeGroup =
    groups.find((g) => g.slug === cat) ??
    groups.find((g) => combined && g.children.includes(combined)) ??
    (currentCat && groupOf(currentCat.id));
  // Subcategoría de la segunda fila que debe verse marcada
  const activeChild = combined ?? activeGroup?.children.find((ch) => currentCat && childCategoryIds(ch).includes(currentCat.id));
  const heading =
    activeGroup && activeGroup.children.length === 1 ? activeGroup.name : combined?.label ?? currentCat?.name ?? activeGroup?.name;

  // Fila de chips: cada grupo ocupa un solo chip, en el lugar de su primera categoría
  const chipItems = useMemo(() => {
    const seen = new Set<string>();
    return categories.flatMap((c) => {
      const g = groups.find((x) => groupCategoryIds(x).includes(c.id));
      if (!g) return [{ id: c.id, slug: c.slug, name: c.name }];
      if (seen.has(g.id)) return [];
      seen.add(g.id);
      return [{ id: g.id, slug: g.slug, name: g.name }];
    });
  }, [categories, groups]);

  const results = useMemo(() => {
    const group = groups.find((g) => g.slug === cat);
    const scope = group ? groupCategoryIds(group) : combined ? childCategoryIds(combined) : null;
    let list = products.filter((p) => {
      const c = categories.find((x) => x.id === p.categoryId);
      if (scope) {
        if (!scope.includes(p.categoryId)) return false;
      } else if (cat !== "all" && c?.slug !== cat) return false;
      if (tags.length && !tags.every((t) => p.tags.includes(t))) return false;
      return matches(p, q, c?.name ?? "");
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.basePrice - b.basePrice);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.basePrice - a.basePrice);
    return list;
  }, [products, categories, groups, combined, cat, tags, q, sort]);

  // Viendo un grupo entero o todo el menú (sin ordenar por precio): secciones por subcategoría
  const sections = useMemo(() => {
    if (currentCat || sort !== "featured") return null;
    const order = groups.flatMap((g) => g.children.flatMap((ch) => ch.sections ?? [ch]));
    const list = order
      .map((ch) => ({ id: ch.id, label: ch.label, items: results.filter((p) => p.categoryId === ch.id) }))
      .filter((sec) => sec.items.length > 0);
    return list.length > 1 ? list : null;
  }, [currentCat, sort, groups, results]);

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
            {[{ id: "all", slug: "all", name: "Todo" }, ...chipItems].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={cat === c.slug || activeGroup?.slug === c.slug}
                onClick={() => {
                  setCat(c.slug);
                  if (c.slug !== "all") track("view_category", { category: c.slug });
                }}
                className={chip(cat === c.slug || activeGroup?.slug === c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Container className="scroll-mt-40 py-10 lg:py-12">
        {!sf.orderingEnabled && <p role="note" className="mb-6 rounded-ui bg-white/[0.05] px-4 py-3 text-[0.9375rem] text-cream2">{content.menu.catalogNote}</p>}

        {activeGroup && activeGroup.children.length > 1 && (
          <div role="group" aria-label={`Tipos de ${activeGroup.name.toLowerCase()}`} className="no-scrollbar -mt-4 mb-7 flex gap-2 overflow-x-auto">
            {[{ id: activeGroup.id, label: activeGroup.allLabel, slug: activeGroup.slug }, ...activeGroup.children.map((ch) => ({ ...ch, slug: ch.sections ? ch.id : categories.find((c) => c.id === ch.id)?.slug ?? ch.id }))].map((ch) => (
              <button
                key={ch.id}
                type="button"
                aria-pressed={cat === ch.slug || activeChild?.id === ch.id}
                onClick={() => {
                  setCat(ch.slug);
                  track("view_category", { category: ch.slug });
                }}
                className={chip(cat === ch.slug || activeChild?.id === ch.id)}
              >
                {ch.label}
              </button>
            ))}
          </div>
        )}

        <div className="mb-7 flex items-baseline justify-between gap-4" role="status" aria-live="polite">
          {heading ? <h2 className="t-h3">{heading}</h2> : <span />}
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
        ) : sections ? (
          <>
            <nav aria-label="Ir a la sección" className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
              {sections.map((sec) => (
                <a key={sec.id} href={`#cat-${sec.id}`} className="shrink-0 whitespace-nowrap rounded-full border border-line px-3.5 py-1.5 text-[0.8125rem] text-cream2 transition-colors hover:border-cream2 hover:text-cream">
                  {sec.label}
                </a>
              ))}
            </nav>
            <div className="space-y-12 lg:space-y-14">
              {sections.map((sec) => (
                <section key={sec.id} aria-labelledby={`cat-${sec.id}`}>
                  <h3 id={`cat-${sec.id}`} className="mb-5 flex items-baseline justify-between gap-4 border-b border-line pb-3 font-display text-[1.5rem] leading-tight">
                    {sec.label}
                    <span className="font-sans text-[0.875rem] text-cream2">{sec.items.length}</span>
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                    {sec.items.map((p) => (<ProductCard key={p.id} product={p} />))}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
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
