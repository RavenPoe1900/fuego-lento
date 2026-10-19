import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/types/restaurant";

/** Acordeón nativo (<details>): accesible por teclado y exclusivo (una respuesta abierta a la vez). */
export function Accordion({ items, name }: { items: FaqItem[]; name: string }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.id} name={name} className="group">
          <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.0625rem] font-semibold [&::-webkit-details-marker]:hidden">
            <span>{f.question}</span>
            <ChevronDown className="size-5 shrink-0 text-cream2 transition-transform duration-200 group-open:rotate-180" aria-hidden />
          </summary>
          <p className="max-w-[65ch] pb-6 pr-8 text-base leading-relaxed text-cream2">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
