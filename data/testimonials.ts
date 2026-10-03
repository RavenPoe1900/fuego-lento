export type Testimonial = { id: string; quote: string; author: string };

/**
 * Testimonios REALES autorizados por quien los escribió.
 * Mientras esté vacío, la sección no se renderiza. No añadir textos de ejemplo.
 */
export const testimonials: Testimonial[] = [];
