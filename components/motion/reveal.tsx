"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { tEditorial } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Desplazamiento vertical en px (12–20 recomendado) */
  y?: number;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "ul";
};

/** Revela su contenido una sola vez al entrar en pantalla. Con reduced-motion solo hace un fade mínimo. */
export function Reveal({ children, className, y = 16, delay = 0, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={reduce ? { duration: 0.15 } : { ...tEditorial, delay }}
    >
      {children}
    </Comp>
  );
}
