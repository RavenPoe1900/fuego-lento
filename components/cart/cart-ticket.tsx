"use client";

import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { restaurant } from "@/config/restaurant";
import { track } from "@/lib/analytics";
import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/currency";
import { useOrderSummary } from "@/lib/use-order-summary";
import { useCart } from "@/store/cart-store";
import { useCheckout } from "@/store/checkout-store";
import { useUi } from "@/store/ui-store";

const ctl = "min-h-9 px-1.5 underline underline-offset-4 hover:text-[#7a2b1f]";

/** Comanda: el pedido como ticket de cocina sobre papel crema. Solo se usa en el drawer. */
export function CartTicket({ onEdit }: { onEdit?: () => void }) {
  const { priced, issues, lines, totals, method } = useOrderSummary();
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const openProduct = useUi((s) => s.openProduct);
  const feeKnown = totals.deliveryFee !== null;

  return (
    <div className="relative bg-[#e9dfce] px-4 py-5 font-mono text-[0.75rem] tabular-nums text-ink shadow-[var(--shadow-sm)] [clip-path:polygon(0_0,100%_0,100%_calc(100%-6px),97%_100%,94%_calc(100%-6px),91%_100%,88%_calc(100%-6px),85%_100%,82%_calc(100%-6px),79%_100%,76%_calc(100%-6px),73%_100%,70%_calc(100%-6px),67%_100%,64%_calc(100%-6px),61%_100%,58%_calc(100%-6px),55%_100%,52%_calc(100%-6px),49%_100%,46%_calc(100%-6px),43%_100%,40%_calc(100%-6px),37%_100%,34%_calc(100%-6px),31%_100%,28%_calc(100%-6px),25%_100%,22%_calc(100%-6px),19%_100%,16%_calc(100%-6px),13%_100%,10%_calc(100%-6px),7%_100%,4%_calc(100%-6px),1%_100%,0_calc(100%-6px))] pb-7">
      <p className="text-center text-[0.8125rem] font-medium tracking-[0.3em]">FUEGO LENTO</p>
      <p className="mb-3 text-center text-[0.65rem] tracking-[0.12em] text-[#6b5a47]">CAFÉ DE TUESTE LENTO</p>
      <hr className="border-t border-dashed border-[#8a7860]" />

      <ul className="py-1">
        {priced.map((p) => {
          const product = getProduct(p.productId)!;
          const issue = issues.find((i) => i.lineId === p.lineId);
          const line = lines.find((l) => l.id === p.lineId)!;
          return (
            <li key={p.lineId} className="py-2">
              <div className="grid grid-cols-[1.5rem_1fr_auto] gap-x-2">
                <span className="font-medium">{line.quantity}</span>
                <span className="text-[0.8125rem] leading-snug">{p.name}</span>
                <span className="text-[0.8125rem] font-medium">{formatPrice(p.lineTotal)}</span>
              </div>
              {(p.details.length > 0 || p.note) && (
                <div className="pl-8 text-[0.6875rem] leading-snug text-[#6b5a47]">
                  {p.details.map((d) => (<div key={d}>{d}</div>))}
                  {p.note && <div className="italic">“{p.note}”</div>}
                </div>
              )}
              {issue && (
                <p role="alert" className="mt-1 flex gap-1.5 pl-8 text-[#7a2b1f]">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden /> {issue.message}
                </p>
              )}
              <div className="mt-0.5 flex flex-wrap justify-end gap-x-1 text-[0.6875rem]">
                <button type="button" aria-label={`Quitar uno de ${p.name}`} className={ctl} onClick={() => setQuantity(line.id, line.quantity - 1)}>− menos</button>
                <button type="button" aria-label={`Agregar uno de ${p.name}`} className={ctl} disabled={line.quantity >= 20} onClick={() => setQuantity(line.id, line.quantity + 1)}>+ más</button>
                {product.available && product.optionGroups.length > 0 && (
                  <button type="button" aria-label={`Editar ${p.name}`} className={ctl} onClick={() => { onEdit?.(); openProduct(product.id, line.id); }}>editar</button>
                )}
                <button
                  type="button"
                  aria-label={`Quitar ${p.name} de la comanda`}
                  className={`${ctl} text-[#7a2b1f]`}
                  onClick={() => {
                    remove(line.id);
                    track("product_removed", { id: p.productId });
                    toast("Producto eliminado", { description: p.name });
                  }}
                >
                  quitar
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <hr className="border-t border-dashed border-[#8a7860]" />
      <dl className="space-y-1 py-2">
        <TicketRow label="Subtotal" value={formatPrice(totals.subtotal)} />
        {method === "delivery" ? (
          <TicketRow label="Envío" value={feeKnown ? formatPrice(totals.deliveryFee as number) : "Por confirmar"} />
        ) : (
          <TicketRow label="Recogida" value="Gratis" />
        )}
        {totals.serviceFee > 0 && <TicketRow label="Servicio" value={formatPrice(totals.serviceFee)} />}
        {totals.discount > 0 && <TicketRow label="Descuento" value={`−${formatPrice(totals.discount)}`} />}
      </dl>
      <hr className="border-t border-dashed border-[#8a7860]" />
      <div className="flex items-baseline justify-between pt-3 text-[0.9375rem] font-medium">
        <span>{method === "delivery" && !feeKnown ? "SUBTOTAL" : "TOTAL"}</span>
        <span>{formatPrice(totals.total)}</span>
      </div>
    </div>
  );
}

/** Delivery / Recogida. Solo se muestra si el local ofrece entrega. */
export function MethodToggle() {
  const method = useCheckout((s) => s.deliveryMethod);
  const set = useCheckout((s) => s.set);
  if (!restaurant.ordering.deliveryEnabled) return null;
  return (
    <div role="group" aria-label="Modo de entrega" className="grid grid-cols-2 gap-2">
      {(["delivery", "pickup"] as const).map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={method === m}
          onClick={() => set({ deliveryMethod: m })}
          className={`min-h-11 rounded-ui border font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors ${
            method === m ? "border-gold bg-surface2 text-gold" : "border-line text-cream2 hover:border-cream/30"
          }`}
        >
          {m === "delivery" ? "Delivery" : "Recogida"}
        </button>
      ))}
    </div>
  );
}

function TicketRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
