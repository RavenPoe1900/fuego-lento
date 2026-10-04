import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Section } from "@/components/shared/layout";
import { SectionHeading } from "@/components/shared/section-heading";
import { content } from "@/config/content";
import { getAllProducts, getVisibleCategoryGroups, groupCategoryIds } from "@/lib/catalog";

/** Ancho de las categorías que cierran la composición, según cuántas queden (1 = franja completa). */
const TAIL_SPAN: Record<number, string> = { 1: "lg:col-span-12", 2: "lg:col-span-6" };

/**
 * Composición asimétrica que se adapta al número real de categorías (2–5):
 * una principal de 7 columnas, hasta dos de 5 a su lado y el resto en una franja inferior.
 * En móvil: carrusel manual con snap (sin autoplay).
 */
export function Families() {
  const items = getVisibleCategoryGroups().filter((g) => g.image).slice(0, 5);
  if (items.length < 2) return null;
  const products = getAllProducts();

  return (
    <Section tone="soft" labelledBy="familias" pad={false} className="py-16 lg:py-24">
      <Container>
        <div className="lg:max-w-[50%]"><SectionHeading id="familias" eyebrow="Familias" title={content.families.title} description={content.families.description} /></div>
        <ul
          aria-label="Familias del menú"
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 scroll-px-4 min-[480px]:-mx-5 min-[480px]:px-5 min-[480px]:scroll-px-5 md:mx-0 md:px-0 md:scroll-px-0 lg:grid lg:grid-cols-12 lg:gap-4 lg:overflow-visible lg:pb-0"
        >
          {items.map((c, i) => {
            const n = products.filter((p) => groupCategoryIds(c).includes(p.categoryId)).length;
            const main = i === 0;
            const side = i > 0 && i < 3;
            const tail = TAIL_SPAN[items.length - 3] ?? "lg:col-span-4";
            const span = main ? `lg:col-span-7 ${items.length > 2 ? "lg:row-span-2" : ""}` : side ? "lg:col-span-5" : tail;
            return (
              <li key={c.id} className={`w-[78%] shrink-0 snap-start sm:w-[56%] md:w-[44%] lg:w-auto ${span}`}>
                <Link
                  href={`/menu/?categoria=${c.slug}`}
                  className={`group relative block aspect-[4/5] overflow-hidden rounded-card lg:aspect-auto lg:h-full ${main ? "lg:min-h-[520px]" : "lg:min-h-[252px]"}`}
                >
                  <Image src={c.image!} alt="" fill sizes={main ? "(min-width:1024px) 700px, 78vw" : "(min-width:1024px) 480px, 78vw"} className="food-image object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon/95 via-carbon/25 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
                    <span>
                      <span className={`block font-display leading-none ${main ? "t-h3" : "text-[1.75rem]"}`}>{c.name}</span>
                      <span className="mt-1.5 block text-[0.8125rem] text-cream2">{n} {n === 1 ? "opción" : "opciones"}</span>
                    </span>
                    <ArrowUpRight className="size-5 shrink-0 text-cream transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
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
