import { formatCupEquivalent, formatPrice, formatUsd } from "@/lib/currency";
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
  section("Cliente", [`Nombre: ${order.customer.name}`]);
  section("Entrega", [
    order.deliveryMethod === "delivery" ? "Entrega a domicilio" : "Recoger en el local",
    order.deliveryMethod === "delivery" && order.address?.street && `Dirección: ${order.address.street}`,
  ]);

  // Con platos preparados y carnes para cocinar en el mismo pedido, cada tipo va en su bloque
  const blocks = [
    { title: "Platos preparados", lines: order.lines.filter((l) => l.line === "carta") },
    { title: "Carnes para cocinar", lines: order.lines.filter((l) => l.line === "carnes") },
  ].filter((b) => b.lines.length);
  const split = blocks.length > 1;
  let n = 0;
  out.push("", "*Pedido*");
  for (const block of blocks) {
    if (split) out.push("", `_${block.title}_`);
    for (const l of block.lines) {
      out.push("", `${++n}. ${l.quantity} × ${l.name}`);
      for (const d of l.details) out.push(`   - ${d}`);
      if (l.note) out.push(`   - Nota: ${l.note}`);
      out.push(`   - Subtotal: ${l.currency === "USD" ? `${formatUsd(l.nativeLineTotal)} (${formatCupEquivalent(l.nativeLineTotal)})` : formatPrice(l.lineTotal)}${l.weighted ? " (estimado, según peso real)" : ""}`);
    }
  }

  const t = order.totals;
  const hasCup = t.cartaSubtotal > 0;
  const hasUsd = t.usdSubtotal > 0;
  const delivery = order.deliveryMethod === "delivery";
  const subtotalWord = delivery ? "Subtotal estimado" : "Total estimado";
  section("Resumen", [
    hasCup && `Platos preparados: ${formatPrice(t.cartaSubtotal)}`,
    hasUsd && `Carnes para cocinar: ${formatUsd(t.usdSubtotal)} (${formatCupEquivalent(t.usdSubtotal)}, aproximado)`,
    t.hasWeighted && "Las piezas por kg se cobran según su peso real.",
    delivery ? "Envío: se confirma por WhatsApp" : "Recogida en el local: sin costo",
    t.serviceFee > 0 && `Servicio: ${formatPrice(t.serviceFee)}`,
    t.discount > 0 && `Descuento: −${formatPrice(t.discount)}`,
    hasCup && !hasUsd && `${subtotalWord}: ${formatPrice(t.total)}`,
    hasUsd && !hasCup && `${subtotalWord}: ${formatUsd(t.usdSubtotal)}`,
    "Pago: se coordina por WhatsApp",
  ]);

  if (order.customer.notes) section("Observaciones generales", [order.customer.notes]);

  out.push("", `Pedido enviado desde la web de ${businessName}.`, "Quedo a la espera de confirmación.");
  return out.join("\n");
}
