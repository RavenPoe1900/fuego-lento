"use client";

import { MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Instagram } from "@/components/shared/icons";
import { Container } from "@/components/shared/layout";
import { content } from "@/config/content";
import { getFooterNavigation, legalNavigation } from "@/config/navigation";
import { restaurant } from "@/config/restaurant";
import { hoursLine } from "@/lib/schedule";
import { useStoreStatus } from "@/lib/use-store-status";

const COL = "eyebrow mb-4 !text-muted";
const link = "inline-flex min-h-11 items-center text-base text-cream2 hover:text-cream";
const DOT = { ok: "bg-ok", gold: "bg-gold", err: "bg-err" } as const;

/** Marca, navegación, contacto y aviso legal. Cada dato existe solo si está confirmado. */
export function Footer() {
  const sf = useStoreStatus();
  const nav = getFooterNavigation(sf);
  const hours = sf.showHours ? hoursLine() : null;
  const address = [restaurant.address, restaurant.city].filter(Boolean).join(", ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name}, ${address}`)}`;

  return (
    <footer id="contacto" className="bg-warm pb-10 pt-14 lg:pt-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <p className="flex items-center gap-2.5 font-display text-[1.9rem] font-semibold">
              <Image src="/img/logo-mark.webp" alt="" width={48} height={48} className="size-11" /> {restaurant.shortName}
            </p>
            <p className="max-w-xs text-base text-cream2">{content.footer.description}</p>
            <p className="flex items-center gap-2 text-[0.9375rem] text-cream2" role="status">
              <span className={`size-2 rounded-full ${sf.ready ? DOT[sf.tone] : "bg-cream2/40"}`} aria-hidden />
              {sf.ready ? sf.label : "…"}
            </p>
          </div>

          {nav.length > 0 && (
            <nav aria-label="Pie de página">
              <h2 className={COL}>Navegación</h2>
              <ul className="space-y-1">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className={link}>{n.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div>
            <h2 className={COL}>Contacto</h2>
            <ul className="space-y-1 text-base">
              {address && (
                <li className="flex items-start gap-3 text-cream2">
                  <MapPin className="mt-3 size-[18px] shrink-0 text-cream2" aria-hidden />
                  <span>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-cream">
                      {address}
                      <span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>
                  </span>
                </li>
              )}
              {hours && <li className="pl-[30px] text-[0.9375rem] text-cream2">Horario: {hours}</li>}
              {restaurant.whatsapp && (
                <li>
                  <a href={`https://wa.me/${restaurant.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 text-cream2 hover:text-cream">
                    <MessageCircle className="size-[18px] shrink-0" aria-hidden /> WhatsApp +{restaurant.whatsapp}
                    <span className="sr-only">(se abre en una pestaña nueva)</span>
                  </a>
                </li>
              )}
              <li>
                <a href={restaurant.instagram.url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 text-cream2 hover:text-cream">
                  <Instagram className="size-[18px] shrink-0" /> {restaurant.instagram.handle}
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[0.9375rem] text-cream2 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-6">
            {legalNavigation.map((n) => (
              <li key={n.href}><Link href={n.href} className="inline-flex min-h-11 items-center hover:text-cream">{n.label}</Link></li>
            ))}
          </ul>
          <p>© {new Date().getFullYear()} {restaurant.name}</p>
        </div>
      </Container>
    </footer>
  );
}
