"use client";

import { Flame, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Instagram } from "@/components/shared/icons";
import { Container } from "@/components/shared/layout";
import { content } from "@/config/content";
import { getFooterNavigation, legalNavigation } from "@/config/navigation";
import { restaurant } from "@/config/restaurant";
import { isPreview } from "@/lib/dev";
import { todayHours } from "@/lib/schedule";
import { useStoreStatus } from "@/lib/use-store-status";

const COL = "eyebrow mb-4 !text-muted";

/** Tres columnas. Cada fila existe solo si el dato está confirmado. */
export function Footer() {
  const sf = useStoreStatus();
  const nav = getFooterNavigation(sf);
  const hoursToday = sf.showHours && sf.ready ? todayHours() : null;
  const contact = [
    restaurant.address && { icon: MapPin, label: "Dirección", value: [restaurant.address, restaurant.city].filter(Boolean).join(", ") },
    restaurant.phone && { icon: Phone, label: "Teléfono", value: restaurant.phone, href: `tel:${restaurant.phone.replace(/\s/g, "")}` },
    restaurant.whatsapp && { icon: MessageCircle, label: "WhatsApp", value: `+${restaurant.whatsapp}`, href: `https://wa.me/${restaurant.whatsapp}` },
    restaurant.email && { icon: Mail, label: "Correo", value: restaurant.email, href: `mailto:${restaurant.email}` },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string }[];
  const legal = isPreview ? legalNavigation : [];

  return (
    <footer id="contacto" className="bg-warm pb-24 pt-14 md:pb-10 lg:pt-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <p className="flex items-center gap-2.5 font-display text-[1.9rem] font-semibold">
              <Flame className="size-7 text-accent" aria-hidden /> {restaurant.shortName}
            </p>
            <p className="max-w-xs text-base text-cream2">{content.footer.description}</p>
          </div>

          {nav.length > 0 && (
            <nav aria-label="Pie de página">
              <h2 className={COL} style={{ fontFamily: "var(--font-ui)" }}>Navegación</h2>
              <ul className="space-y-1">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="inline-block py-1.5 text-base text-cream2 hover:text-cream">{n.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div>
            <h2 className={COL} style={{ fontFamily: "var(--font-ui)" }}>Contacto</h2>
            <ul className="space-y-3 text-base">
              <li className="flex items-center gap-2 text-cream2">
                <span className={`size-2 rounded-full ${sf.tone === "ok" ? "bg-ok" : sf.tone === "gold" ? "bg-gold" : "bg-err"}`} aria-hidden />
                {sf.message || sf.label}
              </li>
              {hoursToday && <li className="text-cream2">Hoy · {hoursToday}</li>}
              {contact.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-3 text-cream2">
                  <Icon className="mt-1 size-[18px] shrink-0 text-accent" aria-hidden />
                  <span><span className="sr-only">{label}: </span>{href ? <a href={href} className="hover:text-cream">{value}</a> : value}</span>
                </li>
              ))}
              <li>
                <a href={restaurant.instagram.url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 text-cream2 hover:text-cream">
                  <Instagram className="size-[18px] shrink-0 text-accent" /> {restaurant.instagram.handle}
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 pt-2 text-[0.9375rem] text-cream2 lg:flex-row lg:items-center lg:justify-between">
          {legal.length > 0 ? (
            <ul className="flex flex-wrap gap-x-6">
              {legal.map((n) => (
                <li key={n.href}><Link href={n.href} className="inline-block py-2 hover:text-cream">{n.label}</Link></li>
              ))}
            </ul>
          ) : <span />}
          <p>© {new Date().getFullYear()} {restaurant.name}. Todos los derechos reservados.</p>
        </div>
      </Container>
    </footer>
  );
}
