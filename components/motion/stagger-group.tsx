"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { tEditorial } from "@/lib/motion";

/**
 * Grupo con escalonado corto. Úsalo solo en listas pequeñas (≤ 8 elementos);
 * en listas largas el stagger se limita para no producir esperas perceptibles.
 */
export function StaggerGroup({ children, className, step = 0.06 }: { children: ReactNode; className?: string; step?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : step } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, y = 14 }: { children: ReactNode; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : y },
        show: { opacity: 1, y: 0, transition: reduce ? { duration: 0.15 } : tEditorial },
      }}
    >
      {children}
    </motion.div>
  );
}
