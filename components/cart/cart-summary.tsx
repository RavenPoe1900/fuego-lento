import { formatPrice } from "@/lib/currency";
import type { Totals } from "@/types/order";
import type { DeliveryMethod } from "@/types/restaurant";

/**
 * Desglose transparente. Si la tarifa de envío no está confirmada se dice "por confirmar"
 * y no se suma nada: el total pasa a llamarse "Subtotal estimado".
 */
export function CartSummary({ totals, method }: { totals: Totals; method: DeliveryMethod }) {
  const feeKnown = totals.deliveryFee !== null;
  return (
    <dl className="space-y-1.5 text-[0.9375rem]">
      <Row label="Productos" value={formatPrice(totals.subtotal)} />
      {method === "delivery" ? (
        <Row label="Envío" value={feeKnown ? formatPrice(totals.deliveryFee as number) : "Por confirmar"} muted={!feeKnown} />
      ) : (
        <Row label="Recogida" value="Sin costo" />
      )}
      {totals.serviceFee > 0 && <Row label="Cargo por servicio" value={formatPrice(totals.serviceFee)} />}
      {totals.discount > 0 && <Row label="Descuento" value={`−${formatPrice(totals.discount)}`} />}
      <div className="flex items-baseline justify-between pt-3 text-lg font-bold">
        <dt>{method === "delivery" && !feeKnown ? "Subtotal estimado" : "Total estimado"}</dt>
        <dd className="tabular-nums">{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-cream2">{label}</dt>
      <dd className={`tabular-nums ${muted ? "text-cream2" : ""}`}>{value}</dd>
    </div>
  );
}
