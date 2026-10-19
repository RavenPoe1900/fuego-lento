import Image from "next/image";
import Link from "next/link";
import { ArrowLink } from "@/components/shared/arrow-link";
import { buttonClass } from "@/components/shared/button";
import { Container, Section } from "@/components/shared/layout";
import { Price } from "@/components/shared/price";
import { content } from "@/config/content";
import { getMeatCategories, getMeatStartingPrice } from "@/lib/catalog";

/**
 * Entrada a Carnes a domicilio: cuatro tarjetas altas con la foto arriba y el texto en un panel.
 * Los paneles alternan crema y dos marrones; en los oscuros la foto es algo más alta, para romper la simetría.
 * En móvil: carrusel manual con snap (sin autoplay).
 */
const PANELS = [
  { panel: "bg-paper text-ink", desc: "text-ink/70", image: "aspect-square", onLight: true },
  { panel: "bg-panel-brasa text-cream", desc: "text-cream/80", image: "aspect-[1/1.07]", onLight: false },
  { panel: "bg-paper text-ink", desc: "text-ink/70", image: "aspect-square", onLight: true },
  { panel: "bg-panel-ceniza text-cream", desc: "text-cream/80", image: "aspect-[1/1.07]", onLight: false },
] as const;

export function MeatCards() {
  const meat = content.meat;
  const items = getMeatCategories();

  return (
    <Section id="carnes" tone="base" labelledBy="carnes-t" pad={false} className="py-16 lg:py-24">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 lg:mb-12 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">{meat.eyebrow}</p>
            <h2 id="carnes-t" className="t-h2 font-light">{meat.title}</h2>
            <p className="lead mt-3 text-cream2">{meat.description}</p>
          </div>
          <ArrowLink href="/carnes/" className="self-start">{meat.allCta}</ArrowLink>
        </div>

        <ul
          aria-label="Carnes a domicilio"
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 scroll-px-4 min-[480px]:-mx-5 min-[480px]:px-5 min-[480px]:scroll-px-5 md:mx-0 md:px-0 md:scroll-px-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0"
        >
          {items.map((c, i) => {
            const p = PANELS[i % PANELS.length];
            return (
              <li key={c.id} className="flex w-[78%] shrink-0 snap-start sm:w-[46%] md:w-[38%] lg:w-auto">
                <Link href={`/carnes/#${c.id}`} className={`group flex w-full flex-col overflow-hidden rounded-panel ${p.panel}`}>
                  <span className={`relative block w-full overflow-hidden ${p.image}`}>
                    <Image src={c.image} alt="" fill sizes="(min-width:1024px) 300px, 78vw" className="food-image object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]" />
                  </span>
                  <span className="flex flex-1 flex-col p-6 sm:p-7">
                    <span className="font-display text-[1.75rem] font-light leading-[1.05] tracking-tight lg:text-[2rem]">{c.name}</span>
                    <span className={`mt-3 block text-[0.9375rem] leading-relaxed ${p.desc}`}>{c.description}</span>
                    <span className="mb-7 mt-5 block">
                      <span className={`mb-1 block font-mono text-[0.6875rem] uppercase tracking-[0.16em] ${p.onLight ? "text-ink/60" : "text-cream/70"}`}>{meat.from}</span>
                      <Price amount={getMeatStartingPrice(c.id)} currency="USD" dual size="md" onLight={p.onLight} />
                    </span>
                    <span className={buttonClass("secondary", "md", `mt-auto self-start pointer-events-none ${p.onLight ? "!border-ink/40 !text-ink" : ""}`)}>{c.cta}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
