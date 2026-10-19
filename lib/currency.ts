import { restaurant } from "@/config/restaurant";
import type { PricedLine, Totals } from "@/types/order";
import type { ProductCurrency } from "@/types/product";

const cupFormatter = new Intl.NumberFormat(restaurant.currency.locale, { maximumFractionDigits: 0 });
const usdFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Importe en CUP: los productos en USD se convierten con `restaurant.fx.usdToCup`. */
export function toCup(amount: number, currency: ProductCurrency = "CUP"): number {
  return currency === "USD" ? Math.round(amount * restaurant.fx.usdToCup) : amount;
}

/** "$11,500 CUP" */
export function formatPrice(amount: number): string {
  return `$${cupFormatter.format(amount)} ${restaurant.currency.code}`;
}

/** "$14.93 USD"; sin sufijo ("$1.88") para importes que ya van rotulados, como el ahorro. */
export function formatUsd(amount: number, suffix = true): string {
  return `$${usdFormatter.format(amount)}${suffix ? " USD" : ""}`;
}

/** Importe en su moneda de origen. */
export function formatMoney(amount: number, currency: ProductCurrency = "CUP"): string {
  return currency === "USD" ? formatUsd(amount) : formatPrice(amount);
}

/** "≈ $20,246 CUP": equivalente de un importe en USD. */
export function formatCupEquivalent(amountUsd: number): string {
  return `≈ ${formatPrice(toCup(amountUsd, "USD"))}`;
}

/** Total de una línea del pedido en la moneda del producto. */
export function formatLineTotal(l: Pick<PricedLine, "currency" | "nativeLineTotal">): string {
  return formatMoney(l.nativeLineTotal, l.currency);
}

/** "+$300" para incrementos de opciones; en USD con decimales ("+$24.28"). */
export function formatDelta(amount: number, currency: ProductCurrency = "CUP"): string {
  return `+${currency === "USD" ? formatUsd(amount, false) : `$${cupFormatter.format(amount)}`}`;
}

/**
 * Importe del pedido para cabecera y avisos. Con una sola moneda, su subtotal; con platos en CUP y carnes
 * en USD no hay cifra única (no se suman monedas distintas) y devuelve null.
 */
export function formatCartAmount(t: Pick<Totals, "cartaSubtotal" | "usdSubtotal">): string | null {
  const hasCup = t.cartaSubtotal > 0;
  const hasUsd = t.usdSubtotal > 0;
  if (hasCup && hasUsd) return null;
  if (hasUsd) return formatUsd(t.usdSubtotal);
  if (hasCup) return formatPrice(t.cartaSubtotal);
  return null;
}

/** "1 USD = 450 CUP" */
export function formatRate(): string {
  return `1 USD = ${cupFormatter.format(restaurant.fx.usdToCup)} ${restaurant.currency.code}`;
}
