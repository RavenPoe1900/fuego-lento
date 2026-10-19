import Link from "next/link";
import { ArrowLink } from "@/components/shared/arrow-link";
import { buttonClass } from "@/components/shared/button";
import { Container, Section } from "@/components/shared/layout";
import { Price } from "@/components/shared/price";
import { content } from "@/config/content";
import { getMeatCategories, getMeatStartingPrice } from "@/lib/catalog";

/**
 * Entrada a Carnes para cocinar: cuatro tarjetas de texto (sin fotos hasta tener las de cada pieza cruda).
 * Cada una dice qué es, cómo se vende y desde qué precio; toda la tarjeta es un enlace a su sección en /carnes.
 */
export function MeatCards() {
  const meat = content.meat;
  const items = getMeatCategories();

  return (
    <Section id="carnes-para-cocinar" tone="base" labelledBy="carnes-t" pad={false} className="py-16 lg:py-24">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 lg:mb-12 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">{meat.eyebrow}</p>
            <h2 id="carnes-t" className="t-h2">{meat.title}</h2>
            <p className="lead mt-3 text-cream2">{meat.description}</p>
            <p className="mt-2 text-[0.9375rem] text-muted">Se entregan crudas. Precios en USD, con su equivalente aproximado en CUP.</p>
          </div>
          <ArrowLink href="/carnes/" className="self-start">{meat.allCta}</ArrowLink>
        </div>

        <ul aria-label="Carnes para cocinar" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((c) => (
            <li key={c.id} className="flex">
              <Link href={`/carnes/#${c.id}`} className="group flex w-full flex-col rounded-card border border-line bg-surface p-6 transition-colors hover:border-cream/25 hover:bg-surface2">
                <span className="font-display text-[1.75rem] leading-[1.05] lg:text-[2rem]">{c.name}</span>
                <span className="mt-3 block text-[0.9375rem] leading-relaxed text-cream2">{c.description}</span>
                <span className="mt-4 block text-[0.8125rem] font-semibold text-cream2">{c.saleFormat}</span>
                <span className="mb-6 mt-4 block">
                  <span className="mb-1 block text-[0.8125rem] text-muted">{meat.from}</span>
                  <Price amount={getMeatStartingPrice(c.id)} currency="USD" dual size="lg" />
                </span>
                <span className={buttonClass("secondary", "md", "mt-auto self-start pointer-events-none")}>{c.cta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
