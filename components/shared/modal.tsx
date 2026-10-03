"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_EDITORIAL, tDrawer } from "@/lib/motion";
import { IconButton } from "./button";

/**
 * Diálogo accesible sobre Radix: atrapa y devuelve el foco, cierra con Escape,
 * bloquea el scroll de fondo y oculta el resto de la página a lectores de pantalla.
 * variant "modal" = centrado (escritorio) / hoja inferior (móvil); "drawer" = lateral derecho
 * (pantalla completa en móvil). Entra y sale con Motion (solo transform y opacity).
 */
export function Dialog({
  open,
  onClose,
  title,
  variant = "modal",
  children,
  footer,
  hideTitle,
  headerExtra,
  onExitComplete,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  variant?: "modal" | "drawer";
  children: ReactNode;
  footer?: ReactNode;
  hideTitle?: boolean;
  headerExtra?: ReactNode;
  /** Se llama cuando la animación de salida termina (para desmontar contenido). */
  onExitComplete?: () => void;
}) {
  const reduce = useReducedMotion();

  const panelClass =
    variant === "drawer"
      ? "ml-auto h-full w-full max-w-[460px] sm:rounded-l-card"
      : "mt-auto h-[92dvh] w-full rounded-t-[20px] sm:m-auto sm:h-auto sm:max-h-[90dvh] sm:max-w-[980px] sm:rounded-card";

  const motionProps = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 } }
    : variant === "drawer"
      ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%", transition: { duration: 0.22, ease: EASE_EDITORIAL } }, transition: tDrawer }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 16, transition: { duration: 0.2, ease: EASE_EDITORIAL } },
          transition: { duration: 0.28, ease: EASE_EDITORIAL },
        };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence onExitComplete={onExitComplete}>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <div className="fixed inset-0 z-[70] flex">
              <DialogPrimitive.Overlay forceMount asChild>
                <motion.div
                  className="absolute inset-0 bg-black/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </DialogPrimitive.Overlay>
              <DialogPrimitive.Content forceMount asChild aria-describedby={undefined}>
                <motion.div
                  {...motionProps}
                  className={`relative flex flex-col overflow-hidden border border-line bg-warm shadow-[var(--shadow)] outline-none ${panelClass}`}
                >
                  <div className="flex shrink-0 items-center justify-between gap-2 border-b border-line px-5 py-2">
                    <DialogPrimitive.Title className={hideTitle ? "sr-only" : "text-2xl"}>{title}</DialogPrimitive.Title>
                    {hideTitle && <span />}
                    <div className="flex items-center gap-1">
                      {headerExtra}
                      <DialogPrimitive.Close asChild>
                        <IconButton label="Cerrar">
                          <X className="size-5" aria-hidden />
                        </IconButton>
                      </DialogPrimitive.Close>
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
                  {footer && <div className="shrink-0 border-t border-line bg-warm p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
