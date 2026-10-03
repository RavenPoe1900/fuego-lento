import { restaurant } from "@/config/restaurant";

const nf = new Intl.NumberFormat(restaurant.currency.locale, { maximumFractionDigits: 0 });

/** Precio compacto en mono: cifra en el acento cobre y moneda discreta en la misma línea. */
export function Price({ amount, size = "md", onLight, className = "" }: { amount: number; size?: "sm" | "md" | "lg"; onLight?: boolean; className?: string }) {
  const num = size === "lg" ? "text-[1.375rem]" : size === "sm" ? "text-[0.9375rem]" : "text-[1.0625rem]";
  return (
    <span className={`whitespace-nowrap font-mono ${className}`}>
      <span className={`${num} font-medium tabular-nums leading-none ${onLight ? "text-accent-light" : "text-accent"}`}>${nf.format(amount)}</span>
      <span className={`ml-1 text-[0.6875rem] uppercase tracking-[0.12em] ${onLight ? "text-ink/60" : "text-muted"}`}>{restaurant.currency.code}</span>
    </span>
  );
}
