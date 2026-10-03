import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Section } from "@/components/shared/layout";
import { SectionHeading } from "@/components/shared/section-heading";
import { categories, homeCategoryIds } from "@/data/categories";
import { content } from "@/config/content";
import { getAllProducts, getVisibleCategories } from "@/lib/catalog";

/** Composición por categorías: una familia dominante (2×2) y cuatro menores. Distinta de la cuadrícula del menú. */
export function Families() {
  const visible = getVisibleCategories().map((c) => c.id);
  const items = homeCategoryIds.filter((id) => visible.includes(id)).map((id) => categories.find((c) => c.id === id)!).filter((c) => c.image).slice(0, 5);
  if (items.length < 5) return null;
  const products = getAllProducts();
  return (
    <Section tone="soft" labelledBy="familias" pad={false} className="py-16 lg:py-24">
      <Container>
        <div className="lg:max-w-[50%]"><SectionHeading id="familias" eyebrow="Familias" title={content.families.title} description={content.families.description} /></div>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {items.map((c, i) => {
            const n = products.filter((p) => p.categoryId === c.id).length;
            const big = i === 0;
            return (
              <li key={c.id} className={big ? "col-span-2 row-span-2" : ""}>
                <Link
                  href={`/menu/?categoria=${c.slug}`}
                  className={`group relative block overflow-hidden rounded-[16px] ${big ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[420px]" : "aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-full lg:min-h-[200px]"}`}
                >
                  <Image src={c.image!} alt="" fill sizes={big ? "(min-width:1024px) 640px, 100vw" : "(min-width:1024px) 320px, 50vw"} className="food-image object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/10 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
                    <span>
                      <span className={`block font-display leading-none ${big ? "t-h3" : "text-[1.5rem] sm:text-[1.75rem]"}`}>{c.name}</span>
                      <span className="mt-1.5 block text-[0.8125rem] text-cream2">{n} {n === 1 ? "plato" : "platos"}</span>
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
