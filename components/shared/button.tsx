import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "soft" | "ghost" | "link";
type Size = "md" | "lg" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-ui transition-colors duration-150 select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";
const variants: Record<Variant, string> = {
  /** Rojo brasa: solo la acción principal de cada sección */
  primary: "bg-ember text-cream shadow-[0_8px_28px_rgba(214,73,47,0.16)] hover:bg-[var(--ember-hover)]",
  /** Borde neutro: acciones secundarias */
  secondary: "border border-cream/[0.22] bg-cream/[0.025] text-cream hover:border-cream/45 hover:bg-cream/[0.07]",
  /** Acciones repetidas (tarjetas): discretas también en hover, nunca rojas */
  soft: "bg-cream/[0.08] text-cream hover:bg-cream/[0.15]",
  ghost: "text-cream2 hover:bg-white/5 hover:text-cream",
  /** Terciaria: texto, sin contenedor */
  link: "!min-h-0 !px-0 gap-1.5 text-cream2 underline-offset-4 hover:text-cream hover:underline",
};
const sizes: Record<Size, string> = {
  sm: "min-h-[46px] px-5",
  md: "min-h-[50px] px-6",
  lg: "min-h-[54px] px-7",
};

/** Rótulo en mono mayúsculas para botones; el enlace terciario conserva la sans de lectura. */
function labelClass(variant: Variant, size: Size) {
  if (variant === "link") return "text-[0.9375rem] font-semibold";
  return `font-mono font-medium uppercase tracking-[0.16em] ${size === "lg" ? "text-[0.8125rem]" : "text-[0.75rem]"}`;
}

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${labelClass(variant, size)} ${extra}`;
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

export function Button({ variant = "primary", size = "md", loading, className = "", children, disabled, ...rest }: Props) {
  return (
    <button className={buttonClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  external,
  onClick,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
  onClick?: () => void;
}) {
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClass(variant, size, className)}>
        {children}
      </a>
    );
  return (
    <Link href={href} onClick={onClick} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}

export function IconButton({
  label,
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex size-11 items-center justify-center rounded-full text-cream transition-colors hover:bg-white/10 active:scale-95 disabled:opacity-40 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
