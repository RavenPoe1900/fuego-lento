import { Container, Section } from "@/components/shared/layout";
import { content } from "@/config/content";

/**
 * Tres pasos, en lectura vertical en móvil. Sin decoración que compita con el texto.
 * Describe el proceso real: la web prepara el resumen, WhatsApp lo envía y el restaurante lo confirma.
 */
export function HowToOrder() {
  const h = content.howToOrder;
  return (
    <Section id="como-pedir" tone="soft" labelledBy="como-pedir-t" pad={false} className="py-16 lg:py-24">
      <Container>
        <h2 id="como-pedir-t" className="t-h2 mb-10 lg:mb-14">{h.title}</h2>
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-14">
          {h.steps.map((s, i) => (
            <li key={s.title} className="border-t border-line pt-6">
              <p aria-hidden className="font-display text-[2.5rem] leading-none text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-5 font-sans text-[1.0625rem] font-semibold leading-snug">{s.title}</h3>
              <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-relaxed text-cream2">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 max-w-2xl text-[0.9375rem] text-cream2">{h.weightNote}</p>
      </Container>
    </Section>
  );
}
