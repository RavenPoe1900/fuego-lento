import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "soft" | "ghost" | "link";
type Size = "md" | "lg" | "sm";

/**
 * Los botones de acción son píldoras; el resto de superficies (campos, tarjetas, paneles) conserva el radio de 3–4 px.
 * Sin sombras ni escalados: la jerarquía la dan el relleno, el borde y el color.
 */
const base =
  "inline-flex items-center justify-center gap-2 py-2 text-center transition-colors duration-150 select-none disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40";
const variants: Record<Variant, string> = {
  /** Rojo brasa: solo la acción principal de cada sección (texto crema ≥ 4.5:1 en reposo, hover y active) */
  primary: "rounded-full bg-ember text-cream hover:bg-ember-hover active:bg-ember-active",
  /** Contorno fino: acciones secundarias */
  secondary: "rounded-full border border-cream/40 text-cream hover:border-cream/70 hover:bg-cream/[0.06] active:bg-cream/10",
  /** Acción repetida (tarjetas): contorno dorado, nunca rojo */
  soft: "rounded-full border border-gold/50 text-gold hover:border-gold hover:bg-gold/10 active:bg-gold/15",
  ghost: "rounded-full text-cream2 hover:bg-cream/[0.06] hover:text-cream active:bg-cream/10",
  /** Terciaria: texto, sin contenedor (mantiene 44 px de alto) */
  link: "gap-1.5 !px-0 text-cream2 underline-offset-4 hover:text-cream hover:underline",
};
const sizes: Record<Size, string> = {
  sm: "min-h-[46px] px-5",
  md: "min-h-[50px] px-6",
  lg: "min-h-[54px] px-7",
};

/** Rótulo en mono mayúsculas para botones; el enlace terciario conserva la sans de lectura. */
function labelClass(variant: Variant, size: Size) {
  if (variant === "link") return "text-[0.9375rem] font-semibold";
  return `font-semibold uppercase tracking-[0.08em] ${size === "lg" ? "text-[0.8125rem]" : "text-[0.75rem]"}`;
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
    <button className={buttonClass(variant, size, `relative ${className}`)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {/* El contenido se queda en el flujo (transparente) para que el botón no cambie de tamaño al cargar */}
      {loading && <Loader2 className="absolute size-4 animate-spin" aria-hidden />}
      <span className={loading ? "inline-flex items-center gap-2 opacity-0" : "contents"}>{children}</span>
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
      className={`inline-flex size-11 items-center justify-center rounded-full text-cream transition-colors hover:bg-white/10 disabled:opacity-40 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
