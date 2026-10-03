/**
 * Filtro rectangular en mono. Activo: acento cobre tenue (no rojo brasa),
 * para que el CTA principal siga siendo la única superficie roja.
 */
export const chipClass = (on: boolean) =>
  `min-h-11 shrink-0 rounded-ui border px-4 font-mono text-[0.75rem] font-medium uppercase tracking-[0.16em] transition-colors ${
    on ? "border-accent/60 bg-accent/15 text-accent" : "border-transparent text-cream2 hover:bg-white/[0.05] hover:text-cream"
  }`;
