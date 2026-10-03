import { restaurant } from "@/config/restaurant";

const formatter = new Intl.NumberFormat(restaurant.currency.locale, { maximumFractionDigits: 0 });

/** "$11,500 CUP" */
export function formatPrice(amount: number): string {
  return `$${formatter.format(amount)} ${restaurant.currency.code}`;
}

/** "+$300" para incrementos de opciones */
export function formatDelta(amount: number): string {
  return `+$${formatter.format(amount)}`;
}
