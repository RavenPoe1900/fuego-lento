"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Contenedor de imagen que se descubre de abajo arriba (clip-path) mientras la foto
 * pasa de 1.12 a 1. Solo se oculta si JS confirma que está fuera de pantalla y no hay
 * reduced-motion: sin JS, en la primera pantalla o con movimiento reducido se ve siempre.
 * Estilos en globals.css ([data-reveal]).
 */
export function RevealImage({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "pending" | "in">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    // Diferido: marcar como pendiente fuera del cuerpo del efecto evita un render en cascada
    // (si el observer ya la mostró, no se vuelve a ocultar).
    const raf = requestAnimationFrame(() => setState((s) => (s === "idle" ? "pending" : s)));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} data-reveal={state === "idle" ? undefined : state} className={className}>
      {children}
    </div>
  );
}
