import { Container, Section } from "@/components/shared/layout";
import { content } from "@/config/content";

/** Pausa editorial: una línea tipográfica desplazada, sin tarjetas ni acciones. */
export function Pause() {
  return (
    <Section tone="base" pad={false} className="py-24 lg:py-36">
      <Container>
        <div className="editorial-grid">
          <p aria-hidden className="eyebrow col-span-12 mb-4 !text-muted lg:col-span-3 lg:mb-0 lg:pt-6">{content.pauseLabel}</p>
          <p className="t-h1 col-span-12 font-display text-cream lg:col-span-9">
            {content.pause.map((w, i) => (
              <span key={w} className={i === 1 ? "text-cream2" : i === 2 ? "text-accent" : ""}>{w} </span>
            ))}
          </p>
        </div>
      </Container>
    </Section>
  );
}
