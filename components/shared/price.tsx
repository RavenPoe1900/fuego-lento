import { restaurant } from "@/config/restaurant";

const nf = new Intl.NumberFormat(restaurant.currency.locale, { maximumFractionDigits: 0 });

/** Precio compacto: cifra destacada y moneda discreta en la misma línea. */
export function Price({ amount, size = "md", className = "" }: { amount: number; size?: "sm" | "md" | "lg"; className?: string }) {
  const num = size === "lg" ? "text-[1.75rem]" : size === "sm" ? "text-lg" : "text-[1.375rem]";
  return (
    <span className={`whitespace-nowrap ${className}`}>
      <span className={`${num} font-bold tabular-nums leading-none`}>${nf.format(amount)}</span>
      <span className="ml-1 text-[0.8125rem] font-medium text-muted">{restaurant.currency.code}</span>
    </span>
  );
}
