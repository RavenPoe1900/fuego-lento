"use client";

import { AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";
import { restaurant } from "@/config/restaurant";
import { track } from "@/lib/analytics";
import { getProduct } from "@/lib/catalog";
import { formatLineTotal, formatPrice, formatRate, formatUsd } from "@/lib/currency";
import { useOrderSummary } from "@/lib/use-order-summary";
import { useCart } from "@/store/cart-store";
import { useCheckout } from "@/store/checkout-store";
import { useUi } from "@/store/ui-store";

// 44 px de alto para el dedo; el subrayado fino mantiene el aire de ticket
const ctl = "inline-flex min-h-11 items-center px-2 underline decoration-ticket-rule decoration-1 underline-offset-4 transition-colors hover:text-ticket-alert disabled:no-underline disabled:opacity-40";

/** Comanda: el pedido como ticket de cocina sobre papel crema. Solo se usa en el drawer. */
export function CartTicket({ onEdit }: { onEdit?: () => void }) {
  const { priced, issues, lines, totals, method } = useOrderSummary();
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const openProduct = useUi((s) => s.openProduct);
  const feeKnown = totals.deliveryFee !== null;

  return (
    <div className="relative bg-ticket px-4 py-5 font-mono text-[0.75rem] tabular-nums text-ink [clip-path:polygon(0_0,100%_0,100%_calc(100%-6px),97%_100%,94%_calc(100%-6px),91%_100%,88%_calc(100%-6px),85%_100%,82%_calc(100%-6px),79%_100%,76%_calc(100%-6px),73%_100%,70%_calc(100%-6px),67%_100%,64%_calc(100%-6px),61%_100%,58%_calc(100%-6px),55%_100%,52%_calc(100%-6px),49%_100%,46%_calc(100%-6px),43%_100%,40%_calc(100%-6px),37%_100%,34%_calc(100%-6px),31%_100%,28%_calc(100%-6px),25%_100%,22%_calc(100%-6px),19%_100%,16%_calc(100%-6px),13%_100%,10%_calc(100%-6px),7%_100%,4%_calc(100%-6px),1%_100%,0_calc(100%-6px))] pb-7">
      <p className="text-center text-[0.8125rem] font-medium uppercase tracking-[0.3em]">{restaurant.shortName}</p>
      <p className="mb-3 text-center text-[0.65rem] tracking-[0.3em] text-ticket-muted">COMANDA</p>
      <hr className="border-t border-dashed border-ticket-rule" />

      <ul className="py-1">
        {priced.map((p) => {
          const product = getProduct(p.productId)!;
          const issue = issues.find((i) => i.lineId === p.lineId);
          const line = lines.find((l) => l.id === p.lineId)!;
          return (
            <li key={p.lineId} className="py-3">
              <div className="grid grid-cols-[1.5rem_1fr_auto] gap-x-2">
                <span className="font-medium">{line.quantity}</span>
                <span className="text-[0.8125rem] leading-snug">{p.name}</span>
                <span className="text-[0.8125rem] font-medium">{formatLineTotal(p)}</span>
              </div>
              {(p.details.length > 0 || p.note) && (
                <div className="pl-8 text-[0.6875rem] leading-snug text-ticket-muted">
                  {p.details.map((d) => (<div key={d}>{d}</div>))}
                  {p.note && <div className="italic">“{p.note}”</div>}
                </div>
              )}
              {issue && (
                <p role="alert" className="mt-1 flex gap-1.5 pl-8 text-ticket-alert">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden /> {issue.message}
                </p>
              )}
              <div className="-mb-1.5 mt-0.5 flex flex-wrap justify-end text-[0.6875rem]">
                <button type="button" aria-label={`Quitar uno de ${p.name}`} className={ctl} onClick={() => setQuantity(line.id, line.quantity - 1)}>− menos</button>
                <button type="button" aria-label={`Agregar uno de ${p.name}`} className={ctl} disabled={line.quantity >= 20} onClick={() => setQuantity(line.id, line.quantity + 1)}>+ más</button>
                {product.available && product.optionGroups.length > 0 && (
                  <button type="button" aria-label={`Editar ${p.name}`} className={ctl} onClick={() => { onEdit?.(); openProduct(product.id, line.id); }}>editar</button>
                )}
                <button
                  type="button"
                  aria-label={`Quitar ${p.name} de la comanda`}
                  className={`${ctl} text-ticket-alert`}
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

      <hr className="border-t border-dashed border-ticket-rule" />
      <dl className="space-y-1 py-2">
        <TicketRow label="Subtotal" value={formatPrice(totals.subtotal)} />
        {totals.usdSubtotal > 0 && <p className="text-[0.6875rem] leading-snug text-ticket-muted">Incluye {formatUsd(totals.usdSubtotal)} convertidos a CUP ({formatRate()}).</p>}
        {method === "delivery" ? (
          <TicketRow label="Envío" value={feeKnown ? formatPrice(totals.deliveryFee as number) : "Por confirmar"} pending={!feeKnown} />
        ) : (
          <TicketRow label="Recogida" value="Gratis" />
        )}
        {totals.serviceFee > 0 && <TicketRow label="Servicio" value={formatPrice(totals.serviceFee)} />}
        {totals.discount > 0 && <TicketRow label="Descuento" value={`−${formatPrice(totals.discount)}`} />}
      </dl>
      <hr className="border-t border-dashed border-ticket-rule" />
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
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-ui border font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors ${
            method === m ? "border-gold bg-gold/10 text-gold" : "border-line text-cream2 hover:border-cream/30"
          }`}
        >
          {method === m && <Check className="size-3.5" aria-hidden />}
          {m === "delivery" ? "Delivery" : "Recogida"}
        </button>
      ))}
    </div>
  );
}

/** `pending`: dato por confirmar por el restaurante; se marca con una superficie dorada tenue sobre el papel. */
function TicketRow({ label, value, pending }: { label: string; value: string; pending?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt>{label}</dt>
      <dd className={pending ? "rounded-ui bg-accent-light/10 px-1.5 py-0.5" : undefined}>{value}</dd>
    </div>
  );
}
