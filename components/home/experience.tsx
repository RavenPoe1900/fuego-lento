import Image from "next/image";
import { content } from "@/config/content";

/** Secuencia fotográfica a sangre: tres planos con una palabra cada uno. Sin texto narrativo. */
export function Experience() {
  const e = content.experience;
  return (
    <section aria-labelledby="experiencia" className="bg-carbon">
      <h2 id="experiencia" className="sr-only">{e.srTitle}</h2>
      <ul className="no-scrollbar flex snap-x snap-mandatory gap-0 overflow-x-auto lg:grid lg:grid-cols-3 lg:overflow-visible">
        {e.panels.map((p, i) => (
          <li key={p.word} className="relative aspect-[3/4] w-[82vw] shrink-0 snap-center sm:w-[56vw] lg:aspect-[4/5] lg:max-h-[720px] lg:w-auto">
            <Image src={p.image.src} alt={p.image.alt} fill sizes="(min-width:1024px) 34vw, 82vw" className="food-image object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-carbon/85 via-carbon/10 to-transparent" />
            <p className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 lg:p-10">
              <span className="font-display t-h2 !leading-none">{p.word}</span>
              <span className="mb-1 text-sm font-semibold tabular-nums text-cream2" aria-hidden>{String(i + 1).padStart(2, "0")} / {String(e.panels.length).padStart(2, "0")}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
