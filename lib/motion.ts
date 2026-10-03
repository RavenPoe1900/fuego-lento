import type { Transition, Variants } from "motion/react";

/** Curva editorial: entradas de contenido y revelados. */
export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;
/** Curva funcional: acciones rápidas y claras. */
export const EASE_FUNCTIONAL = [0.4, 0, 0.2, 1] as const;

export const duration = {
  hover: 0.15,
  control: 0.2,
  overlay: 0.3,
  reveal: 0.5,
  hero: 0.85,
} as const;

export const tEditorial: Transition = { duration: duration.reveal, ease: EASE_EDITORIAL };
export const tOverlay: Transition = { duration: duration.overlay, ease: EASE_EDITORIAL };
export const tControl: Transition = { duration: duration.control, ease: EASE_FUNCTIONAL };
/** Resorte muy contenido: solo para elementos físicos como el drawer. */
export const tDrawer: Transition = { type: "spring", stiffness: 420, damping: 42, mass: 0.9 };

export const instant: Transition = { duration: 0 };

export const fadeUp = (distance = 16): Variants => ({
  hidden: { opacity: 0, y: distance },
  show: { opacity: 1, y: 0, transition: tEditorial },
});
