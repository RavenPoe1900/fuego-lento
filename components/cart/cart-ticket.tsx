"use client";

import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { restaurant } from "@/config/restaurant";
import { track } from "@/lib/analytics";
import { getProduct } from "@/lib/catalog";
import { formatCupEquivalent, formatLineTotal, formatPrice, formatUsd } from "@/lib/currency";
import { useOrderSummary } from "@/lib/use-order-summary";
import { useCart } from "@/store/cart-store";
import { useCheckout } from "@/store/checkout-store";
import { useUi } from "@/store/ui-store";

// 44 px de alto para el dedo; el subrayado fino mantiene el aire de ticket
const ctl = "inline-flex min-h-11 items-center px-2 underline decoration-ticket-rule decoration-1 underline-offset-4 transition-colors hover:text-ticket-alert disabled:no-underline disabled:opacity-40";

/**
 * Mi pedido: el pedido como ticket de cocina sobre papel crema. Solo se usa en el panel lateral.
 * Las líneas se agrupan por tipo de compra y cada tipo conserva su moneda: platos preparados en CUP,
 * carnes para cocinar en USD. Nunca se suma una moneda con otra.
 */
export function CartTicket({ onEdit }: { onEdit?: () => void }) {
  const { priced, issues, lines, totals, method } = useOrderSummary();
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const openProduct = useUi((s) => s.openProduct);

  const groups = [
    { key: "carta", title: "Platos preparados", items: priced.filter((p) => p.line === "carta") },
    { key: "carnes", title: "Carnes para cocinar", items: priced.filter((p) => p.line === "carnes") },
  ].filter((g) => g.items.length > 0);
  const hasCup = totals.cartaSubtotal > 0;
  const hasUsd = totals.usdSubtotal > 0;
  const mixed = hasCup && hasUsd;
  const delivery = method === "delivery";

  return (
    <div className="relative bg-ticket px-4 py-5 text-[0.8125rem] tabular-nums text-ink [clip-path:polygon(0_0,100%_0,100%_calc(100%-6px),97%_100%,94%_calc(100%-6px),91%_100%,88%_calc(100%-6px),85%_100%,82%_calc(100%-6px),79%_100%,76%_calc(100%-6px),73%_100%,70%_calc(100%-6px),67%_100%,64%_calc(100%-6px),61%_100%,58%_calc(100%-6px),55%_100%,52%_calc(100%-6px),49%_100%,46%_calc(100%-6px),43%_100%,40%_calc(100%-6px),37%_100%,34%_calc(100%-6px),31%_100%,28%_calc(100%-6px),25%_100%,22%_calc(100%-6px),19%_100%,16%_calc(100%-6px),13%_100%,10%_calc(100%-6px),7%_100%,4%_calc(100%-6px),1%_100%,0_calc(100%-6px))] pb-7">
      <p className="text-center text-[0.8125rem] font-semibold uppercase tracking-[0.2em]">{restaurant.shortName}</p>
      <p className="mb-3 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ticket-muted">Mi pedido</p>

      {groups.map((g) => (
        <section key={g.key} aria-label={g.title}>
          <hr className="border-t border-dashed border-ticket-rule" />
          <h3 className="mt-3 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ticket-muted">{g.title}</h3>
          <ul className="py-1">
            {g.items.map((p) => {
              const product = getProduct(p.productId)!;
              const issue = issues.find((i) => i.lineId === p.lineId);
              const line = lines.find((l) => l.id === p.lineId)!;
              return (
                <li key={p.lineId} className="py-3">
                  <div className="grid grid-cols-[1.5rem_1fr_auto] gap-x-2">
                    <span className="font-semibold">{line.quantity}</span>
                    <span className="font-sans text-[0.875rem] leading-snug">{p.name}</span>
                    <span className="font-semibold">{formatLineTotal(p)}</span>
                  </div>
                  {(p.details.length > 0 || p.note || p.weighted) && (
                    <div className="pl-8 text-[0.75rem] leading-snug text-ticket-muted">
                      {p.details.map((d) => (<div key={d}>{d}</div>))}
                      {p.weighted && <div>Importe estimado: se cobra según el peso real</div>}
                      {p.note && <div className="italic">“{p.note}”</div>}
                    </div>
                  )}
                  {issue && (
                    <p role="alert" className="mt-1 flex gap-1.5 pl-8 text-ticket-alert">
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden /> {issue.message}
                    </p>
                  )}
                  <div className="-mb-1.5 mt-0.5 flex flex-wrap justify-end text-[0.75rem]">
                    <button type="button" aria-label={`Quitar uno de ${p.name}`} className={ctl} disabled={line.quantity <= 1} onClick={() => setQuantity(line.id, line.quantity - 1)}>− menos</button>
                    <button type="button" aria-label={`Agregar uno de ${p.name}`} className={ctl} disabled={line.quantity >= 20} onClick={() => setQuantity(line.id, line.quantity + 1)}>+ más</button>
                    {product.available && product.optionGroups.length > 0 && (
                      <button type="button" aria-label={`Editar ${p.name}`} className={ctl} onClick={() => { onEdit?.(); openProduct(product.id, line.id); }}>editar</button>
                    )}
                    <button
                      type="button"
                      aria-label={`Quitar ${p.name} del pedido`}
                      className={`${ctl} text-ticket-alert`}
                      onClick={() => {
                        remove(line.id);
                        track("product_removed", { id: p.productId });
                        toast("Producto quitado", { description: p.name });
                      }}
                    >
                      quitar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <hr className="border-t border-dashed border-ticket-rule" />
      <dl className="space-y-1.5 py-2">
        {hasCup && <TicketRow label={mixed ? "Platos preparados" : "Subtotal"} value={formatPrice(totals.cartaSubtotal)} />}
        {hasUsd && (
          <TicketRow
            label={mixed ? "Carnes para cocinar" : "Subtotal"}
            value={formatUsd(totals.usdSubtotal)}
            sub={`${formatCupEquivalent(totals.usdSubtotal)} aprox.`}
          />
        )}
        {totals.hasWeighted && <p className="text-[0.75rem] leading-snug text-ticket-muted">Las piezas por kg se cobran según el peso real: el importe es una estimación.</p>}
        {delivery ? <TicketRow label="Envío" value="Se confirma por WhatsApp" pending /> : <TicketRow label="Recogida en el local" value="Sin costo" />}
        {totals.serviceFee > 0 && <TicketRow label="Servicio" value={formatPrice(totals.serviceFee)} />}
        {totals.discount > 0 && <TicketRow label="Descuento" value={`−${formatPrice(totals.discount)}`} />}
      </dl>
      <hr className="border-t border-dashed border-ticket-rule" />
      {mixed ? (
        <p className="pt-3 text-[0.75rem] leading-snug text-ticket-muted">Cada tipo de compra va en su moneda y no se suman entre sí. El total se confirma por WhatsApp.</p>
      ) : (
        <div className="flex items-baseline justify-between pt-3 text-[0.9375rem] font-semibold">
          <span>{delivery ? "Subtotal estimado" : "Total estimado"}</span>
          <span>{hasUsd ? formatUsd(totals.usdSubtotal) : formatPrice(totals.total)}</span>
        </div>
      )}
    </div>
  );
}

/** Entrega a domicilio o recogida en el local. Solo se muestra si el local ofrece ambas. */
export function MethodToggle() {
  const method = useCheckout((s) => s.deliveryMethod);
  const set = useCheckout((s) => s.set);
  if (!restaurant.ordering.deliveryEnabled || !restaurant.ordering.pickupEnabled) return null;
  const address = [restaurant.address, restaurant.city].filter(Boolean).join(", ");
  return (
    <div>
      <div role="group" aria-label="Cómo quieres recibir tu pedido" className="grid grid-cols-2 gap-2">
        {(["delivery", "pickup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={method === m}
            onClick={() => set({ deliveryMethod: m })}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-ui border px-2 text-[0.8125rem] font-semibold transition-colors ${
              method === m ? "border-gold bg-gold/10 text-gold-soft" : "border-line text-cream2 hover:border-cream/30"
            }`}
          >
            {method === m && <span aria-hidden>✓</span>}
            {m === "delivery" ? "A domicilio" : "Recoger en el local"}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[0.8125rem] leading-snug text-cream2">
        {method === "delivery" ? "El coste del envío y si llegamos a tu zona se confirman por WhatsApp." : `Recoge tu pedido en ${address}. Sin costo de envío.`}
      </p>
    </div>
  );
}

/** `pending`: dato por confirmar por el restaurante; se marca con una superficie dorada tenue sobre el papel. */
function TicketRow({ label, value, sub, pending }: { label: string; value: string; sub?: string; pending?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt>{label}</dt>
      <dd className={`text-right ${pending ? "rounded-ui bg-accent-light/10 px-1.5 py-0.5" : ""}`}>
        {value}
        {sub && <span className="block text-[0.75rem] text-ticket-muted">{sub}</span>}
      </dd>
    </div>
  );
}
