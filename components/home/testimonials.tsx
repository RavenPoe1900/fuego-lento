import { Container, Section } from "@/components/shared/layout";
import { content } from "@/config/content";
import { testimonials } from "@/data/testimonials";

/** Solo existe con testimonios reales cargados en data/testimonials.ts. */
export function Testimonials() {
  if (!testimonials.length) return null;
  return (
    <Section tone="base" labelledBy="testimonios" pad={false} className="py-16 lg:py-24">
      <Container>
        <h2 id="testimonios" className="mb-8 t-h2">{content.testimonials.title}</h2>
        <ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {testimonials.map((t) => (
            <li key={t.id} className="w-[85%] shrink-0 snap-start sm:w-[420px]">
              <figure className="h-full rounded-[16px] bg-surface2 p-7 ring-1 ring-white/[0.06]">
                <blockquote className="font-display text-[1.5rem] leading-snug">“{t.quote}”</blockquote>
                <figcaption className="mt-5 text-[0.9375rem] text-cream2">{t.author}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
