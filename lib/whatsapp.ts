import { formatPrice } from "@/lib/currency";
import type { OrderSummary } from "@/types/order";

/**
 * Quita espacios, guiones, paréntesis y "+". Devuelve null si no parece un número
 * internacional válido (código de país + número: entre 10 y 15 dígitos).
 */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/[\s\-().+]/g, "");
  return /^\d{10,15}$/.test(digits) ? digits : null;
}

/** Única función que construye el enlace. El número viene de la configuración. */
export function buildWhatsAppUrl(phone: string | null, message: string): string | null {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

/** Mensaje legible, derivado del estado actual. Sin identificadores internos ni campos vacíos. */
export function buildWhatsAppMessage(order: OrderSummary, businessName: string): string {
  const out: string[] = [];
  const section = (title: string, rows: (string | null | undefined | false)[]) => {
    const lines = rows.filter(Boolean) as string[];
    if (!lines.length) return;
    out.push("", `*${title}*`, ...lines);
  };

  out.push(`*NUEVO PEDIDO — ${businessName.toUpperCase()}*`);
  section("Cliente", [`Nombre: ${order.customer.name}`, `Teléfono: ${order.customer.phone}`]);
  section("Modalidad", [order.deliveryMethod === "delivery" ? "Entrega a domicilio" : "Recogida en el restaurante"]);

  const a = order.address;
  section("Entrega", [
    order.deliveryMethod === "delivery" && order.zoneName && `Zona: ${order.zoneName}`,
    order.deliveryMethod === "delivery" && a?.street && `Dirección: ${a.street}`,
    order.deliveryMethod === "delivery" && a?.reference && `Referencia: ${a.reference}`,
    order.deliveryMethod === "delivery" && a?.instructions && `Instrucciones: ${a.instructions}`,
    order.scheduleLabel && `Horario solicitado: ${order.scheduleLabel}`,
  ]);

  out.push("", "*Pedido*");
  order.lines.forEach((l, i) => {
    out.push("", `${i + 1}. ${l.quantity} × ${l.name}`);
    for (const d of l.details) out.push(`   - ${d}`);
    if (l.note) out.push(`   - Nota: ${l.note}`);
    out.push(`   - Subtotal: ${formatPrice(l.lineTotal)}`);
  });

  const t = order.totals;
  const feeKnown = t.deliveryFee !== null;
  section("Resumen", [
    `Productos: ${formatPrice(t.subtotal)}`,
    order.deliveryMethod === "delivery" ? `Envío: ${feeKnown ? formatPrice(t.deliveryFee as number) : "Por confirmar"}` : null,
    t.serviceFee > 0 && `Servicio: ${formatPrice(t.serviceFee)}`,
    t.discount > 0 && `Descuento: −${formatPrice(t.discount)}`,
    `Total estimado: ${order.deliveryMethod === "delivery" && !feeKnown ? "Pendiente de confirmar" : formatPrice(t.total)}`,
    `Pago preferido: ${order.paymentLabel ?? "Por coordinar"}`,
  ]);

  if (order.customer.notes) section("Observaciones generales", [order.customer.notes]);

  out.push("", `Pedido enviado desde la web de ${businessName}.`, "Quedo a la espera de confirmación.");
  return out.join("\n");
}
