"use client";

import { AlertCircle, Check, Info } from "lucide-react";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/shared/badge";
import { Button } from "@/components/shared/button";
import { Dialog } from "@/components/shared/modal";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { restaurant } from "@/config/restaurant";
import { content } from "@/config/content";
import { track } from "@/lib/analytics";
import { isDev } from "@/lib/dev";
import { getProduct } from "@/lib/catalog";
import { formatDelta, formatPrice } from "@/lib/currency";
import { groupRuleText, normalizeNote, unitPrice, validateSelections } from "@/lib/order-calculations";
import { useStoreStatus } from "@/lib/use-store-status";
import { useCart } from "@/store/cart-store";
import { useUi } from "@/store/ui-store";
import type { Selections } from "@/types/order";
import type { OptionGroup, Product } from "@/types/product";
import { ProductImage } from "./product-image";
import { ProductTags } from "./product-labels";

type Snapshot = { key: string; product: Product; line?: { id: string; quantity: number; selections: Selections; note: string } };

/**
 * Montaje global: se abre desde cualquier tarjeta o desde el carrito (editar).
 * Conserva una copia del contenido hasta que termina la animación de salida.
 */
export function ProductDetailHost() {
  const target = useUi((s) => s.product);
  const close = useUi((s) => s.closeProduct);
  const lines = useCart((s) => s.lines);
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const product = target ? getProduct(target.productId) : undefined;
  const line = target?.lineId ? lines.find((l) => l.id === target.lineId) : undefined;
  const key = product ? `${product.id}-${line?.id ?? "new"}` : null;
  if (product && key && snap?.key !== key) setSnap({ key, product, line });
  if (!snap) return null;
  return <ProductDetail key={snap.key} open={key === snap.key} product={snap.product} line={snap.line} onClose={close} onExitComplete={() => setSnap(null)} />;
}

function defaultSelections(product: Product): Selections {
  const out: Selections = {};
  for (const g of product.optionGroups) {
    // Sustituciones: se preselecciona lo incluido para no obligar a decidir.
    if (g.kind === "substitution") {
      const inc = g.options.find((o) => o.included && o.available);
      if (inc) out[g.id] = [inc.id];
    }
  }
  return out;
}

function ProductDetail({ open, product, line, onClose, onExitComplete }: { open: boolean; product: Product; line?: Snapshot["line"]; onClose: () => void; onExitComplete: () => void }) {
  const add = useCart((s) => s.add);
  const replace = useCart((s) => s.replace);
  const { orderingEnabled, showPrices, message } = useStoreStatus();
  const openCart = useUi((s) => s.openCart);
  const [selections, setSelections] = useState<Selections>(() => line?.selections ?? defaultSelections(product));
  const [quantity, setQuantity] = useState(line?.quantity ?? 1);
  const [note, setNote] = useState(line?.note ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const bodyRef = useRef<HTMLDivElement>(null);

  const canBuy = product.available && orderingEnabled;
  const showPrice = showPrices;
  const unit = unitPrice(product, selections);
  const total = unit * quantity;

  useEffect(() => {
    if (!line) track("product_viewed", { id: product.id });
  }, [line, product.id]);

  const toggle = useCallback(
    (group: OptionGroup, optionId: string) => {
      setSelections((prev) => {
        const current = prev[group.id] ?? [];
        let next: string[];
        if (group.maxSelections === 1) next = [optionId];
        else next = current.includes(optionId) ? current.filter((x) => x !== optionId) : current.length < group.maxSelections ? [...current, optionId] : current;
        return { ...prev, [group.id]: next };
      });
      setErrors((e) => {
        if (!e[group.id]) return e;
        const rest = { ...e };
        delete rest[group.id];
        return rest;
      });
    },
    [],
  );

  const submit = () => {
    const found = validateSelections(product, selections);
    if (found.length) {
      setErrors(Object.fromEntries(found.map((e) => [e.groupId, e.message])));
      // Desplaza hasta la primera opción con error y le da foco
      const el = bodyRef.current?.querySelector<HTMLElement>(`#grp-${found[0].groupId}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }
    const input = { productId: product.id, quantity, selections, note: normalizeNote(note) };
    if (line) {
      replace(line.id, input);
      track("product_updated", { id: product.id });
      toast.success("Pedido actualizado");
    } else {
      add(input);
      track("product_added", { id: product.id, quantity });
      toast.success("Producto añadido", { description: product.name });
    }
    onClose();
    if (line) openCart();
  };

  const stateText = useMemo(() => {
    if (!product.available) return "Producto agotado por ahora.";
    if (!orderingEnabled) return `${message || "Ahora mismo no estamos recibiendo pedidos"}. Este producto es de consulta.`;
    return null;
  }, [product.available, orderingEnabled, message]);

  const buttonLabel = line ? "Guardar cambios" : "Añadir";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onExitComplete={onExitComplete}
      title={product.name}
      hideTitle
      footer={
        canBuy ? (
          <div className="flex items-center gap-3">
            <QuantitySelector value={quantity} onChange={setQuantity} label={product.name} />
            <Button size="lg" className="flex-1" onClick={submit}>
              <span>{buttonLabel} {line ? "" : quantity > 1 ? `${quantity} al pedido` : "al pedido"}</span>
              {showPrice && <span className="tabular-nums">· {formatPrice(total)}</span>}
            </Button>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-sm text-cream2" role="status">
            <Info className="size-4 shrink-0" aria-hidden /> {stateText}
          </p>
        )
      }
    >
      <div ref={bodyRef} className="grid sm:grid-cols-[1fr_1.05fr]">
        <div className="relative sm:sticky sm:top-0 sm:self-start">
          <ProductImage product={product} ratio="aspect-[4/3] sm:aspect-[4/5]" sizes="(min-width:640px) 480px, 100vw" priority />
          {product.images[0] && <span className="sr-only">{product.images[0].alt}</span>}
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          <header>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {!product.available ? <Badge tone="err">Agotado</Badge> : <ProductTags product={product} />}
              {isDev && product.isDemo && <Badge tone="gold">[DEV] Producto de ejemplo</Badge>}
            </div>
            <h2 className="text-[2rem] leading-tight sm:text-4xl">{product.name}</h2>
            {showPrice ? (
              <p className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums">{formatPrice(unit)}</span>
                {product.compareAtPrice && <s className="text-cream2 tabular-nums">{formatPrice(product.compareAtPrice)}</s>}
              </p>
            ) : (
              <p className="mt-2 text-cream2">Precio por confirmar</p>
            )}
            <p className="mt-3 leading-relaxed text-cream2">{product.description}</p>
            {product.size && <p className="mt-2 text-sm text-cream2">Tamaño: {product.size}</p>}
          </header>

          {product.includes && (
            <section aria-labelledby="inc">
              <h3 id="inc" className="mb-2 text-lg">Incluye</h3>
              <ul className="space-y-1.5 text-cream2">
                {product.includes.map((i) => (
                  <li key={i} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden />{i}</li>
                ))}
              </ul>
            </section>
          )}

          {product.optionGroups.map((g) => (
            <OptionGroupField key={g.id} group={g} chosen={selections[g.id] ?? []} error={errors[g.id]} onToggle={toggle} disabled={!canBuy} showPrice={showPrice} />
          ))}

          {canBuy && (
            <div className="space-y-1.5">
              <label htmlFor="note" className="block text-sm font-medium">
                Instrucciones especiales <span className="text-cream2">(opcional)</span>
              </label>
              <textarea
                id="note"
                value={note}
                maxLength={restaurant.ordering.maxNoteLength}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ej.: sin sal, salsa aparte…"
                className="min-h-20 w-full rounded-ui border border-line bg-surface px-4 py-3 text-base focus:border-fire focus:outline-none focus:ring-2 focus:ring-fire/40"
              />
              <p className="text-right text-xs text-cream2">{note.length}/{restaurant.ordering.maxNoteLength}</p>
            </div>
          )}

          <section aria-labelledby="ing" className="space-y-3 border-t border-line pt-5 text-sm">
            {product.ingredients.length > 0 && (
              <div>
                <h3 id="ing" className="mb-1 text-lg">Ingredientes</h3>
                <p className="text-cream2">{product.ingredients.join(", ")}.</p>
              </div>
            )}
            <div className="rounded-ui border border-gold/40 bg-gold/10 p-3">
              <p className="font-semibold text-[#e3bd88]">
                Alérgenos: {product.allergens.length ? product.allergens.join(", ") : "ninguno declarado"}
              </p>
              {orderingEnabled && <p className="mt-1 text-cream2">{content.allergyNotice}</p>}
            </div>
          </section>
        </div>
      </div>
    </Dialog>
  );
}

function OptionGroupField({
  group,
  chosen,
  error,
  onToggle,
  disabled,
  showPrice,
}: {
  group: OptionGroup;
  chosen: string[];
  error?: string;
  onToggle: (g: OptionGroup, id: string) => void;
  disabled: boolean;
  showPrice: boolean;
}) {
  const single = group.maxSelections === 1;
  const full = !single && chosen.length >= group.maxSelections;
  return (
    <fieldset
      id={`grp-${group.id}`}
      tabIndex={-1}
      aria-describedby={error ? `grp-${group.id}-err` : undefined}
      aria-invalid={!!error}
      className={`rounded-card border p-4 outline-none ${error ? "border-err bg-err/5" : "border-line"}`}
    >
      <legend className="px-1">
        <span className="text-lg font-semibold">{group.name}</span>
      </legend>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        {group.required ? <Badge tone="ember">Obligatorio</Badge> : <Badge>Opcional</Badge>}
        <span className="text-cream2">{groupRuleText(group)}</span>
        {!single && <span className="ml-auto text-cream2 tabular-nums">{chosen.length}/{group.maxSelections}</span>}
      </div>
      {group.helpText && <p className="mb-3 text-sm leading-snug text-cream2">{group.helpText}</p>}
      <div className="space-y-2">
        {group.options.map((o) => {
          const checked = chosen.includes(o.id);
          const off = disabled || !o.available || (!single && full && !checked);
          return (
            <label
              key={o.id}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-ui border px-3 py-2 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fire ${
                checked ? "border-fire bg-ember/15" : "border-line hover:bg-white/5"
              } ${off && !checked ? "cursor-not-allowed opacity-45" : ""}`}
            >
              <input
                type={single ? "radio" : "checkbox"}
                name={group.id}
                checked={checked}
                disabled={off && !checked}
                onChange={() => onToggle(group, o.id)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={`flex size-5 shrink-0 items-center justify-center border ${single ? "rounded-full" : "rounded-md"} ${checked ? "border-fire bg-fire text-carbon" : "border-cream2/60"}`}
              >
                {checked && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              <span className="flex-1">
                <span className="block leading-tight">{o.name}</span>
                {!o.available && <span className="text-xs text-err">Agotado</span>}
                {o.included && o.available && <span className="text-xs text-ok">Incluido</span>}
              </span>
              {showPrice && o.priceDelta > 0 && <span className="text-sm font-semibold tabular-nums text-cream2">{formatDelta(o.priceDelta)}</span>}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`grp-${group.id}-err`} role="alert" className="mt-3 flex items-center gap-2 text-sm font-medium text-err">
          <AlertCircle className="size-4 shrink-0" aria-hidden /> {error}
        </p>
      )}
    </fieldset>
  );
}
