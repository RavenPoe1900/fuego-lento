"use client";

import { Check, ChevronRight, Plus, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { Button } from "@/components/shared/button";
import { Price } from "@/components/shared/price";
import type { Product } from "@/types/product";
import { ProductImage } from "./product-image";
import { ProductTags } from "./product-labels";
import { useProductAction } from "./use-product-action";

type Variant = "default" | "main" | "row";

/**
 * Tarjeta de producto. Solo lo necesario para decidir: imagen, nombre,
 * descripción corta, precio y acción. Ingredientes, alérgenos y opciones viven en el detalle.
 * - default: tarjeta vertical (menú); en móvil, fila compacta para ver ~4 productos por pantalla.
 * - main: producto principal de la portada, imagen dominante.
 * - row: tarjeta compacta horizontal (secundarios de la portada).
 */
export function ProductCard({ product, variant = "default", priority }: { product: Product; variant?: Variant; priority?: boolean }) {
  const { soldOut, canBuy, showPrice, needsChoice, priceVaries, added, open, quickAdd } = useProductAction(product);
  const main = variant === "main";
  const row = variant === "row";
  /** default en móvil: fila compacta con acción solo icono */
  const compact = variant === "default";
  const iconOnly = compact ? "max-sm:!min-h-11 max-sm:w-11 max-sm:!px-0" : "";
  const label = compact ? "max-sm:sr-only" : "";

  const action = soldOut || !canBuy ? (
    <Button variant="soft" size="sm" onClick={open} aria-label={`Ver detalle de ${product.name}`} className={iconOnly}>
      <span className={label}>Ver detalle</span>{compact && <ChevronRight className="size-4 sm:hidden" aria-hidden />}
    </Button>
  ) : needsChoice ? (
    // Falta una elección obligatoria sin valor por defecto (cocción, salsas…): se hace en el detalle
    <Button variant="soft" size="sm" onClick={open} aria-label={`Elegir opciones de ${product.name}`} className={iconOnly}>
      <SlidersHorizontal className="size-4" aria-hidden /> <span className={label}>Elegir opciones</span>
    </Button>
  ) : (
    <Button variant="soft" size="sm" onClick={quickAdd} aria-label={`Añadir ${product.name} al pedido`} className={`${iconOnly} ${added ? "!bg-ok" : ""}`}>
      {added ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
      <span className={label}>{added ? "Añadido" : "Añadir al pedido"}</span>
    </Button>
  );

  const price = showPrice ? (
    <div>
      {priceVaries && <span className={`block text-[0.8125rem] text-muted ${compact ? "max-sm:text-[0.75rem]" : ""}`}>Desde</span>}
      <Price amount={product.basePrice} size={main ? "lg" : "md"} />
    </div>
  ) : null;

  // Una sola etiqueta como máximo
  const tag = soldOut ? <Badge tone="err">Agotado</Badge> : product.tags.length ? <ProductTags product={{ ...product, tags: product.tags.slice(0, 1) }} /> : null;

  return (
    <article
      className={`group relative flex h-full overflow-hidden rounded-card bg-white/[0.03] ring-1 ring-white/[0.07] transition-[transform,background-color,box-shadow] duration-[220ms] ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:bg-white/[0.045] hover:shadow-[0_16px_32px_rgba(0,0,0,0.35)] motion-reduce:hover:translate-y-0 ${
        row ? "flex-row" : compact ? "flex-row sm:flex-col" : "flex-col"
      } ${soldOut ? "opacity-75" : ""}`}
    >
      <button type="button" onClick={open} aria-label={`Ver detalle de ${product.name}`} className={`relative block text-left ${row ? "min-h-[132px] w-[38%] shrink-0" : ""} ${compact ? "max-sm:w-[34%] max-sm:shrink-0" : ""} ${main ? "flex-1" : ""}`}>
        {row ? (
          <div className="absolute inset-0">
            <ProductImage product={product} sizes="240px" ratio="h-full w-full" className={soldOut ? "grayscale" : ""} />
          </div>
        ) : (
          <ProductImage
            product={product}
            priority={priority}
            sizes={main ? "(min-width:1024px) 640px, 100vw" : "(min-width:1024px) 420px, (min-width:640px) 50vw, 40vw"}
            ratio={main ? "aspect-[4/3] lg:aspect-auto lg:absolute lg:inset-0" : "aspect-[4/3] max-sm:aspect-auto max-sm:absolute max-sm:inset-0"}
            className={soldOut ? "grayscale" : ""}
          />
        )}
        {soldOut && <span className="absolute inset-0 bg-carbon/40" aria-hidden />}
        {!row && <div className={`absolute left-4 top-4 z-10 flex gap-1.5 ${compact ? "max-sm:hidden" : ""}`}>{tag}</div>}
      </button>

      <div className={`flex flex-col ${row ? "flex-1 p-4" : main ? "p-6 lg:p-8" : "min-w-0 flex-1 p-3.5 sm:p-6"}`}>
        {row && tag && <div className="mb-2 flex">{tag}</div>}
        <h3 className={`leading-tight ${main ? "text-[1.75rem] lg:text-[2.25rem]" : row ? "text-[1.25rem]" : "text-[1.1875rem] sm:text-[1.375rem]"}`}>
          <button type="button" onClick={open} className="text-left hover:text-accent focus-visible:text-accent">{product.name}</button>
        </h3>
        {!row && (
          <p className={`mt-2 leading-relaxed text-cream2 ${main ? "line-clamp-1 text-base" : "line-clamp-1 text-[0.875rem] max-sm:mt-1 sm:line-clamp-2 sm:text-base"}`}>{product.shortDescription}</p>
        )}
        <div className={`mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-3 ${row ? "pt-3" : main ? "pt-5" : "flex-nowrap pt-2.5 sm:flex-wrap sm:pt-5"}`}>
          {price}
          {action}
        </div>
      </div>
    </article>
  );
}
