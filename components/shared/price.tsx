import { restaurant } from "@/config/restaurant";
import { toCup } from "@/lib/currency";
import type { ProductCurrency } from "@/types/product";

const nf = new Intl.NumberFormat(restaurant.currency.locale, { maximumFractionDigits: 0 });
const usdNf = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Precio compacto en mono: cifra en el acento cobre y moneda discreta en la misma línea.
 * Con `currency="USD"` y `dual`, debajo va el equivalente aproximado en CUP.
 */
export function Price({
  amount,
  currency = "CUP",
  dual,
  size = "md",
  onLight,
  className = "",
}: {
  amount: number;
  currency?: ProductCurrency;
  dual?: boolean;
  size?: "sm" | "md" | "lg";
  onLight?: boolean;
  className?: string;
}) {
  const num = size === "lg" ? "text-[1.375rem]" : size === "sm" ? "text-[0.9375rem]" : "text-[1.0625rem]";
  const usd = currency === "USD";
  const soft = onLight ? "text-ink/60" : "text-muted";
  return (
    <span className={`whitespace-nowrap font-mono ${className}`}>
      <span className={`${num} font-medium tabular-nums leading-none ${onLight ? "text-accent-light" : "text-accent"}`}>${usd ? usdNf.format(amount) : nf.format(amount)}</span>
      <span className={`ml-1 text-[0.6875rem] uppercase tracking-[0.12em] ${soft}`}>{usd ? "USD" : restaurant.currency.code}</span>
      {usd && dual && (
        <span className={`mt-1 block text-[0.6875rem] tabular-nums tracking-[0.06em] ${soft}`}>≈ ${nf.format(toCup(amount, "USD"))} {restaurant.currency.code}</span>
      )}
    </span>
  );
}
