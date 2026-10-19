import Image from "next/image";
import { Container, Section } from "@/components/shared/layout";
import { content } from "@/config/content";

/**
 * Tres pasos sobre una banda de fondo claro, sin tarjetas: título con barra a la izquierda,
 * etiquetas pequeñas a la derecha, una foto ancha en el centro y los pasos numerados debajo.
 */
export function HowToOrder() {
  const h = content.howToOrder;
  return (
    <Section id="como-pedir" tone="paper" labelledBy="como-pedir-t" pad={false} className="py-16 lg:py-24">
      <Container>
        <div className="editorial-grid items-start gap-y-6">
          <h2 id="como-pedir-t" className="t-h2 col-span-12 font-light lg:col-span-6">
            <span aria-hidden className="mr-2 text-accent-light">/</span>
            {h.title}
          </h2>
          {h.labels.map((l, i) => (
            <p key={l} className={`eyebrow col-span-6 !text-ink/70 lg:col-span-3 lg:pt-4 ${i === 0 ? "lg:col-start-7" : ""}`}>
              <span aria-hidden>/ </span>
              {l}
            </p>
          ))}
        </div>

        <div className="relative my-10 aspect-[16/9] overflow-hidden rounded-card sm:aspect-[21/8] lg:my-14">
          <Image src={h.image.src} alt={h.image.alt} fill sizes="(min-width:1280px) 1280px, 100vw" className="food-image object-cover" />
        </div>

        <ol className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-14">
          {h.steps.map((s, i) => (
            <li key={s.title}>
              <p aria-hidden className="font-display text-[2.5rem] font-light leading-none text-accent-light">{String(i + 1).padStart(2, "0")}.</p>
              <h3 className="mt-6 font-sans text-[0.8125rem] font-semibold uppercase leading-snug tracking-[0.08em]">{s.title}</h3>
              <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink/75">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
