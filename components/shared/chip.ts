/**
 * Filtro: texto mono sin contenedor. El estado activo se marca en dorado y con un subrayado fino
 * (no depende solo del color); el rojo brasa queda reservado al CTA principal.
 * Sin padding horizontal para que el texto se alinee con el contenido: separa los filtros con `gap-x-7`.
 * Sirve para botones (aria-pressed) y para enlaces de navegación interna.
 */
export const chipClass = (on: boolean) =>
  `relative inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center text-[0.75rem] font-semibold uppercase tracking-[0.08em] transition-colors after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:transition-transform after:duration-300 after:ease-(--ease-editorial) ${
    on ? "text-accent after:scale-x-100 after:bg-accent" : "text-cream2 after:scale-x-0 after:bg-cream/40 hover:text-cream hover:after:scale-x-100"
  }`;
