import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Acción secundaria editorial: texto en mono con subrayado fino y una flecha larga a la derecha.
 * - ArrowLink: navegación (enlace interno o externo).
 * - ArrowButton: acción que no navega (abrir un diálogo, etc.).
 * La flecha es decorativa; al pasar el ratón se desplaza sin alterar el flujo del documento.
 * `onLight` es para fondos claros (sección de cobertura). `caps={false}` para textos largos.
 */

type Style = { onLight?: boolean; caps?: boolean; className?: string };

const wrap = ({ onLight, caps = true, className = "" }: Style) =>
  `group inline-flex min-h-11 items-center gap-6 font-mono text-[0.75rem] font-medium transition-colors ${caps ? "uppercase tracking-[0.16em]" : "tracking-[0.06em]"} ${
    onLight ? "text-ink hover:text-ink" : "text-cream hover:text-cream"
  } ${className}`;

const label = (onLight?: boolean) =>
  `underline decoration-1 underline-offset-[7px] transition-colors ${onLight ? "decoration-ink/35 group-hover:decoration-ink" : "decoration-accent/50 group-hover:decoration-accent"}`;

/** Flecha de trazo fino. Solo se mueve con `motion-safe`; el desplazamiento es transform, no layout. */
function Arrow({ onLight }: { onLight?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 10"
      className={`h-2.5 w-9 shrink-0 transition-transform duration-300 ease-(--ease-editorial) motion-safe:group-hover:translate-x-1.5 sm:w-10 ${onLight ? "text-accent-light" : "text-accent"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0.5 5h38.5M34 1l4.5 4-4.5 4" />
    </svg>
  );
}

export function ArrowLink({ href, external, children, ...style }: { href: string; external?: boolean; children: ReactNode } & Style) {
  const content = (
    <>
      <span className={label(style.onLight)}>{children}</span>
      <Arrow onLight={style.onLight} />
    </>
  );
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={wrap(style)}>
        {content}
        <span className="sr-only">(se abre en una pestaña nueva)</span>
      </a>
    );
  return (
    <Link href={href} className={wrap(style)}>
      {content}
    </Link>
  );
}

export function ArrowButton({ children, onLight, caps, className, ...rest }: { children: ReactNode } & Style & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button type="button" className={wrap({ onLight, caps, className })} {...rest}>
      <span className={label(onLight)}>{children}</span>
      <Arrow onLight={onLight} />
    </button>
  );
}
