"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Container } from "@/components/shared/layout";
import { content } from "@/config/content";

const AUTOPLAY_MS = 3000;
const RESUME_AFTER_TOUCH_MS = 3000;
/** Copias del carril. La del medio es la real; el resto solo da margen a ambos lados. */
const COPIES = 5;
const MIDDLE = 2;

/**
 * Secuencia fotográfica en carrusel circular: nunca hay principio ni final.
 * El carril se repite COPIES veces y, cuando el scroll se detiene, se recoloca sin animar en la
 * copia central (posición visualmente idéntica). Avanza solo cada 3 s; se detiene al pasar el
 * ratón, enfocar o tocar, con la pestaña oculta o la sección fuera de pantalla y siempre con
 * prefers-reduced-motion. Scroll nativo con snap (táctil y teclado).
 */
export function Experience() {
  const e = content.experience;
  const n = e.panels.length;
  const track = useRef<HTMLUListElement>(null);
  const interacting = useRef(false);
  const visible = useRef(false);
  const touchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  /** Distancia entre paneles consecutivos (ancho + hueco). */
  const stride = () => {
    const items = track.current?.querySelectorAll("li");
    return items && items.length > 1 ? (items[1] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft : 0;
  };

  /** Mantiene scrollLeft dentro de la copia central sumando o restando vueltas completas. */
  const recenter = () => {
    const el = track.current;
    const s = stride();
    if (!el || !s) return;
    const loop = s * n;
    let left = el.scrollLeft;
    if (left >= loop * MIDDLE && left < loop * (MIDDLE + 1)) return;
    while (left < loop * MIDDLE) left += loop;
    while (left >= loop * (MIDDLE + 1)) left -= loop;
    el.scrollTo({ left, behavior: "instant" });
  };

  // Colocación inicial en la copia central, antes de pintar
  useLayoutEffect(() => {
    recenter();
    window.addEventListener("resize", recenter);
    return () => window.removeEventListener("resize", recenter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recolocación cuando el scroll se detiene (no durante el desplazamiento suave)
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(recenter, 140);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advance = () => {
    const el = track.current;
    const s = stride();
    if (!el || !s) return;
    el.scrollBy({ left: s, behavior: "smooth" });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; }, { threshold: 0.4 });
    io.observe(el);
    const id = setInterval(() => {
      if (interacting.current || !visible.current || document.hidden) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      advance();
    }, AUTOPLAY_MS);
    return () => {
      io.disconnect();
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hold = () => { interacting.current = true; clearTimeout(touchTimer.current); };
  const release = (delay = 0) => {
    clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => { interacting.current = false; }, delay);
  };

  return (
    <section aria-labelledby="experiencia" className="overflow-hidden bg-carbon py-16 lg:py-24">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">{e.eyebrow}</p>
            <h2 id="experiencia" className="t-h2">{e.title}</h2>
          </div>
        </div>
      </Container>

      <ul
        ref={track}
        tabIndex={0}
        aria-label={e.title}
        onPointerEnter={hold}
        onPointerLeave={() => release()}
        onFocus={hold}
        onBlur={() => release()}
        onTouchStart={hold}
        onTouchEnd={() => release(RESUME_AFTER_TOUCH_MS)}
        className="bleed-right no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto lg:mt-12"
      >
        {Array.from({ length: COPIES }, (_, copy) =>
          e.panels.map((p, i) => (
            // Solo la copia central es contenido real: el resto es relleno visual oculto a lectores de pantalla
            <li key={`${copy}-${p.word}`} aria-hidden={copy !== MIDDLE || undefined} className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[30vw] xl:w-[27rem]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-card">
                <Image src={p.image.src} alt={copy === MIDDLE ? p.image.alt : ""} fill sizes="(min-width:1280px) 432px, (min-width:1024px) 30vw, (min-width:640px) 44vw, 78vw" className="food-image object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon/85 via-carbon/10 to-transparent" />
                <p className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 lg:p-6">
                  <span className="font-display text-[2rem] font-light leading-none">{p.word}</span>
                  <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-cream2 tabular-nums" aria-hidden>
                    {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                  </span>
                </p>
              </div>
            </li>
          )),
        )}
      </ul>
    </section>
  );
}
