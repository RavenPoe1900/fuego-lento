"use client";

import Image from "next/image";
import { RevealImage } from "@/components/motion/reveal-image";
import { Container, Section } from "@/components/shared/layout";
import { content } from "@/config/content";
import { isPreview } from "@/lib/dev";
import { useStoreStatus } from "@/lib/use-store-status";

/**
 * Texto editorial con mucho aire. Describe la oferta; no afirma historia ni trayectoria.
 * Con fotos aprobadas (o en la vista previa): 12 columnas en 5/4/3 escalonadas
 * (producto · texto · ambiente). Sin fotos: solo tipografía.
 */
export function Manifesto() {
  const { orderingEnabled } = useStoreStatus();
  const m = content.manifesto;
  const text = `${m.text}${orderingEnabled ? m.textOrdering : "."}`;
  const [product, ambience] = m.imagesApproved || isPreview ? m.images : [];

  return (
    <Section tone="base" pad={false} labelledBy="manifiesto" className="py-24 lg:py-36">
      <Container>
        <div className="flex flex-col items-center gap-y-6 text-center">
          <p className="eyebrow">{m.label}</p>
          <div>
            <h2 id="manifiesto" className="t-h1">{m.title}</h2>
            {!product && <p className="mx-auto mt-8 max-w-[55ch] font-display text-[clamp(1.5rem,2.4vw,2.25rem)] font-light leading-snug text-cream2">{text}</p>}
          </div>
        </div>

        {product && ambience && (
          <div className="editorial-grid mt-14 items-center gap-y-10 lg:mt-16">
            <RevealImage className="relative col-span-7 aspect-[4/5] overflow-hidden rounded-card lg:col-span-4">
              <Image src={product.src} alt={product.alt} fill sizes="(min-width:1024px) 33vw, 58vw" className="food-image object-cover" />
            </RevealImage>
            <p className="col-span-12 row-start-1 max-w-[34ch] font-display text-[clamp(1.5rem,2.2vw,2.1rem)] font-light leading-snug text-cream2 lg:col-span-4 lg:row-start-auto lg:max-w-none lg:self-center lg:px-4 lg:text-center">
              {text}
            </p>
            <RevealImage className="relative col-span-5 mt-20 aspect-[2/3] overflow-hidden rounded-card lg:col-span-4 lg:mt-0 lg:aspect-[4/5]">
              <Image src={ambience.src} alt={ambience.alt} fill sizes="(min-width:1024px) 33vw, 42vw" className="food-image object-cover object-[10%_55%]" />
            </RevealImage>
          </div>
        )}
      </Container>
    </Section>
  );
}
