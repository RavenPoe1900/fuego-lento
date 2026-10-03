"use client";

import { Bike, CalendarClock, Flame, Wallet } from "lucide-react";
import { Container, Section } from "@/components/shared/layout";
import { restaurant } from "@/config/restaurant";
import { useStoreStatus } from "@/lib/use-store-status";

/** Franja breve: solo aparece cuando el servicio está activo, y solo lo que existe en la configuración. */
export function TrustStrip() {
  const sf = useStoreStatus();
  const o = restaurant.ordering;
  if (!sf.orderingEnabled) return null;
  const items = [
    (o.deliveryEnabled || o.pickupEnabled) && { icon: Bike, title: "Entrega o recogida", text: "Elige cómo recibirlo." },
    { icon: Flame, title: "Cocción a tu gusto", text: "Personaliza cada corte." },
    restaurant.paymentMethods.some((p) => p.enabled) && { icon: Wallet, title: "Pago flexible", text: "Consulta los métodos disponibles." },
    o.scheduledEnabled && sf.showHours && { icon: CalendarClock, title: "Pide o programa", text: "Elige el mejor horario." },
  ].filter(Boolean) as { icon: typeof Bike; title: string; text: string }[];
  return (
    <Section tone="soft" pad={false} className="py-9 lg:py-11">
      <Container>
        <h2 className="sr-only">Por qué pedir con nosotros</h2>
        <ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ember/15 text-fire"><Icon className="size-[22px]" aria-hidden /></span>
              <div>
                <p className="text-base font-semibold leading-tight">{title}</p>
                <p className="mt-0.5 text-[0.9375rem] leading-snug text-cream2">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
