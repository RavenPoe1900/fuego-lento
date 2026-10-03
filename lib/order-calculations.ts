/**
 * Reglas de precio y validación del pedido.
 * Única fuente de verdad: la usa la interfaz y la vuelve a ejecutar la creación
 * del pedido (y deberá ejecutarla el servidor cuando exista backend).
 * El carrito nunca guarda precios: siempre se recalculan desde el catálogo.
 */
import { restaurant } from "@/config/restaurant";
import { getProduct } from "@/lib/catalog";
import { formatDelta } from "@/lib/currency";
import { sanitizeText } from "@/lib/text";
import type { CartLine, PricedLine, Selections, Totals } from "@/types/order";
import type { OptionGroup, Product } from "@/types/product";

export type SelectionError = { groupId: string; message: string };

/** Texto de la regla del grupo: "Elige 1", "Elige hasta 2"… */
export function groupRuleText(group: OptionGroup): string {
  const { minSelections: min, maxSelections: max, kind } = group;
  if (min === max) return `Elige ${min}`;
  if (min > 0) return `Elige de ${min} a ${max}`;
  if (kind === "remove") return "Opcional";
  if (kind === "extra") return `Puedes añadir hasta ${max}`;
  return `Elige hasta ${max}`;
}

function nounFor(group: OptionGroup, n: number): string {
  switch (group.kind) {
    case "cooking":
      return "término";
    case "sauce":
      return n === 1 ? "salsa" : "salsas";
    case "extra":
      return n === 1 ? "extra" : "extras";
    case "side":
    case "substitution":
      return n === 1 ? "acompañamiento" : "acompañamientos";
    default:
      return n === 1 ? "opción" : "opciones";
  }
}

export function validateSelections(product: Product, selections: Selections): SelectionError[] {
  const errors: SelectionError[] = [];
  for (const group of product.optionGroups) {
    const chosen = selections[group.id] ?? [];
    const invalid = chosen.filter((id) => !group.options.some((o) => o.id === id && o.available));
    if (invalid.length) {
      errors.push({ groupId: group.id, message: "Una opción elegida ya no está disponible. Revisa tu selección." });
      continue;
    }
    if (chosen.length < group.minSelections) {
      const missing = group.minSelections;
      errors.push({
        groupId: group.id,
        message:
          group.kind === "cooking"
            ? "Elige el término de cocción para continuar."
            : `Elige ${missing} ${nounFor(group, missing)} para continuar.`,
      });
    } else if (chosen.length > group.maxSelections) {
      errors.push({ groupId: group.id, message: `Puedes elegir como máximo ${group.maxSelections}.` });
    }
  }
  return errors;
}

export function selectionsDelta(product: Product, selections: Selections): number {
  let delta = 0;
  for (const group of product.optionGroups) {
    for (const id of selections[group.id] ?? []) {
      delta += group.options.find((o) => o.id === id)?.priceDelta ?? 0;
    }
  }
  return delta;
}

export function unitPrice(product: Product, selections: Selections): number {
  return product.basePrice + selectionsDelta(product, selections);
}

/** Descripción legible de las opciones: ["Término: Medio", "Extras: Tocino (+$300)"] */
export function selectionDetails(product: Product, selections: Selections): string[] {
  const details: string[] = [];
  for (const group of product.optionGroups) {
    const chosen = (selections[group.id] ?? [])
      .map((id) => group.options.find((o) => o.id === id))
      .filter((o): o is NonNullable<typeof o> => Boolean(o));
    if (!chosen.length) continue;
    const names = chosen.map((o) => (o.priceDelta > 0 ? `${o.name} (${formatDelta(o.priceDelta)})` : o.name)).join(", ");
    details.push(group.kind === "remove" ? names : `${group.name.replace(/ incluido$/, "")}: ${names}`);
  }
  return details;
}

export function normalizeNote(note: string): string {
  return sanitizeText(note, restaurant.ordering.maxNoteLength);
}

/**
 * Identidad de una línea: dos artículos solo se agrupan si coinciden producto,
 * todas las opciones e instrucciones (normalizadas).
 */
export function lineKey(productId: string, selections: Selections, note: string): string {
  const parts = Object.keys(selections)
    .filter((g) => (selections[g] ?? []).length > 0)
    .sort()
    .map((g) => `${g}=${[...selections[g]].sort().join(",")}`);
  return `${productId}|${parts.join(";")}|${normalizeNote(note).toLowerCase()}`;
}

export type CartIssue = {
  lineId: string;
  type: "missing" | "unavailable" | "options";
  message: string;
};

/** Recalcula cada línea desde el catálogo y detecta problemas que impiden confirmar. */
export function priceCart(lines: CartLine[]): { priced: PricedLine[]; issues: CartIssue[] } {
  const priced: PricedLine[] = [];
  const issues: CartIssue[] = [];
  for (const line of lines) {
    const product = getProduct(line.productId);
    if (!product) {
      issues.push({ lineId: line.id, type: "missing", message: "Este producto ya no está en el menú." });
      continue;
    }
    if (!product.available) {
      issues.push({ lineId: line.id, type: "unavailable", message: "Este producto se ha agotado. Elimínalo para continuar." });
    } else if (validateSelections(product, line.selections).length) {
      issues.push({ lineId: line.id, type: "options", message: "Alguna opción cambió. Edita el artículo para revisarlo." });
    }
    const quantity = Math.max(1, Math.min(20, Math.floor(line.quantity)));
    const price = unitPrice(product, line.selections);
    priced.push({
      lineId: line.id,
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice: price,
      lineTotal: price * quantity,
      details: selectionDetails(product, line.selections),
      note: normalizeNote(line.note),
    });
  }
  return { priced, issues };
}

export function computeTotals(priced: PricedLine[], deliveryFee: number | null): Totals {
  const subtotal = priced.reduce((sum, l) => sum + l.lineTotal, 0);
  const serviceFee = Math.round((subtotal * restaurant.serviceFeePercent) / 100);
  // No existen promociones configuradas: el descuento solo se aplicará si una regla real lo valida.
  const discount = 0;
  return {
    subtotal,
    deliveryFee,
    serviceFee,
    discount,
    total: subtotal + (deliveryFee ?? 0) + serviceFee - discount,
    itemCount: priced.reduce((n, l) => n + l.quantity, 0),
  };
}
