"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { tControl } from "@/lib/motion";

/** Contador con cambio vertical corto. Con reduced-motion cambia al instante. */
export function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`relative inline-flex overflow-hidden tabular-nums ${className ?? ""}`} aria-hidden>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={reduce ? false : { y: "70%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: "-70%", opacity: 0 }}
          transition={tControl}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
