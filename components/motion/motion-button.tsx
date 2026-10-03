"use client";

import { Check, Loader2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonClass } from "@/components/shared/button";
import { tControl } from "@/lib/motion";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  /** Muestra el estado "éxito" (icono + successLabel) en lugar del contenido */
  success?: boolean;
  successLabel?: string;
  children: ReactNode;
};

/** Botón con estados de carga y éxito comunicados con texto e icono, no solo con color. */
export function MotionButton({ variant = "primary", size = "md", loading, success, successLabel = "Añadido", className = "", children, disabled, ...rest }: Props) {
  const reduce = useReducedMotion();
  return (
    <button
      className={buttonClass(variant, size, `${success ? "!bg-ok" : ""} ${className}`)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={success ? "ok" : "idle"}
          className="inline-flex items-center gap-2"
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={tControl}
        >
          {success ? (
            <>
              <Check className="size-4" aria-hidden /> {successLabel}
            </>
          ) : (
            children
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
