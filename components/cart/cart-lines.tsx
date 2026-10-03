"use client";

import { AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { ProductImage } from "@/components/menu/product-image";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { track } from "@/lib/analytics";
import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/currency";
import { useOrderSummary } from "@/lib/use-order-summary";
import { useCart } from "@/store/cart-store";
import { useUi } from "@/store/ui-store";

/** Líneas del pedido: se usa en el drawer y en el primer paso del checkout. */
export function CartLines({ onEdit }: { onEdit?: () => void }) {
  const { priced, issues, lines } = useOrderSummary();
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const openProduct = useUi((s) => s.openProduct);
  const reduce = useReducedMotion();

  return (
    <ul className="divide-y divide-white/[0.07]">
      <AnimatePresence initial={false}>
        {priced.map((p) => {
          const product = getProduct(p.productId)!;
          const issue = issues.find((i) => i.lineId === p.lineId);
          const line = lines.find((l) => l.id === p.lineId)!;
          return (
            <motion.li
              key={p.lineId}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-4 overflow-hidden py-5 first:pt-0"
            >
              <ProductImage product={product} ratio="aspect-square" sizes="80px" className="size-20 shrink-0 rounded-ui" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[1.25rem] leading-tight">{p.name}</h3>
                  <span className="font-mono text-[0.9375rem] font-medium text-accent tabular-nums">{formatPrice(p.lineTotal)}</span>
                </div>
                <p className="font-mono text-[0.75rem] text-muted tabular-nums">{formatPrice(p.unitPrice)} c/u</p>
                {p.details.length > 0 && (
                  <ul className="mt-1.5 text-sm leading-snug text-cream2">{p.details.map((d) => (<li key={d}>{d}</li>))}</ul>
                )}
                {p.note && <p className="mt-1 text-sm italic text-cream2">“{p.note}”</p>}
                {issue && (
                  <p role="alert" className="mt-2 flex gap-2 text-sm text-err">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden /> {issue.message}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <QuantitySelector value={line.quantity} onChange={(q) => setQuantity(line.id, q)} min={0} label={p.name} />
                  <div className="flex">
                    {product.available && product.optionGroups.length > 0 && (
                      <button
                        type="button"
                        aria-label={`Editar ${p.name}`}
                        title="Editar"
                        className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10"
                        onClick={() => { onEdit?.(); openProduct(product.id, line.id); }}
                      >
                        <Pencil className="size-4" aria-hidden />
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label={`Eliminar ${p.name}`}
                      title="Eliminar"
                      className="inline-flex size-11 items-center justify-center rounded-full text-err hover:bg-err/10"
                      onClick={() => {
                        remove(line.id);
                        track("product_removed", { id: p.productId });
                        toast("Producto eliminado", { description: p.name });
                      }}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
