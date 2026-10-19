import { formatCupEquivalent, formatPrice, formatRate, formatUsd } from "@/lib/currency";
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
  section("Cliente", [`Nombre: ${order.customer.name}`, order.customer.phone && `Teléfono: ${order.customer.phone}`]);
  section("Modalidad", [order.deliveryMethod === "delivery" ? "Entrega a domicilio" : "Recogida en el restaurante"]);

  const a = order.address;
  section("Entrega", [
    order.deliveryMethod === "delivery" && order.zoneName && `Zona: ${order.zoneName}`,
    order.deliveryMethod === "delivery" && a?.street && `Dirección: ${a.street}`,
    order.deliveryMethod === "delivery" && a?.reference && `Referencia: ${a.reference}`,
    order.deliveryMethod === "delivery" && a?.instructions && `Instrucciones: ${a.instructions}`,
    order.scheduleLabel && `Horario solicitado: ${order.scheduleLabel}`,
  ]);

  // Con carnes a domicilio y carta en el mismo pedido, cada línea de venta va en su bloque
  const blocks = [
    { title: "Carta del restaurante", lines: order.lines.filter((l) => l.line === "carta") },
    { title: "Carnes a domicilio", lines: order.lines.filter((l) => l.line === "carnes") },
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
      out.push(`   - Subtotal: ${l.currency === "USD" ? `${formatUsd(l.nativeLineTotal)} (${formatCupEquivalent(l.nativeLineTotal)})` : formatPrice(l.lineTotal)}`);
    }
  }

  const t = order.totals;
  const feeKnown = t.deliveryFee !== null;
  section("Resumen", [
    `Productos: ${formatPrice(t.subtotal)}`,
    t.usdSubtotal > 0 && `Incluye ${formatUsd(t.usdSubtotal)} convertidos a CUP (${formatRate()})`,
    order.lines.some((l) => l.line === "carnes" && l.details.some((d) => d.startsWith("Peso aproximado"))) && "Las piezas por kg se cobran según su peso real.",
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
