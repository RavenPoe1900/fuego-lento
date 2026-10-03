import type { ReactNode } from "react";

type ContainerSize = "default" | "wide" | "narrow";
const containerClass: Record<ContainerSize, string> = {
  default: "container-x",
  wide: "container-wide",
  narrow: "container-narrow",
};

/** Contenedor centrado. Cada sección controla su ancho interior. */
export function Container({ size = "default", className = "", children }: { size?: ContainerSize; className?: string; children: ReactNode }) {
  return <div className={`${containerClass[size]} ${className}`}>{children}</div>;
}

export type Tone = "base" | "soft" | "raised" | "paper" | "terra";
const tones: Record<Tone, string> = {
  base: "bg-carbon text-cream",
  soft: "bg-warm text-cream",
  raised: "bg-surface text-cream",
  paper: "bg-paper text-ink",
  terra: "bg-terra text-cream",
};

/** Sección con espaciado vertical consistente y fondo según el tono. */
export function Section({
  id,
  tone = "base",
  className = "",
  labelledBy,
  pad = true,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  labelledBy?: string;
  pad?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tones[tone]} ${pad ? "section-pad" : ""} ${className}`}>
      {children}
    </section>
  );
}
