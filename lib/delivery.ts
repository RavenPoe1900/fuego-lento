import { restaurant } from "@/config/restaurant";
import { deliveryZones } from "@/data/delivery-zones";
import type { DeliveryZone } from "@/types/restaurant";

/** Valor del selector para "mi zona no aparece" */
export const OUTSIDE_ZONE = "fuera";

export type Coverage =
  | { status: "unknown" }
  | { status: "outside" }
  | {
      status: "covered";
      zone: DeliveryZone;
      /** null = tarifa por confirmar */
      fee: number | null;
      /** null = sin pedido mínimo configurado */
      minOrder: number | null;
      missing: number;
    };

/** Cobertura por zona. Debe validarse antes de abrir WhatsApp. */
export function checkCoverage(zoneId: string | null | undefined, subtotal: number): Coverage {
  if (!zoneId) return { status: "unknown" };
  const zone = deliveryZones.find((z) => z.id === zoneId && z.available);
  if (!zone) return { status: "outside" };
  const minOrder = zone.minOrder ?? restaurant.ordering.minOrder ?? null;
  return { status: "covered", zone, fee: zone.fee, minOrder, missing: minOrder === null ? 0 : Math.max(0, minOrder - subtotal) };
}

export function etaText(zone: DeliveryZone): string | null {
  return zone.etaMinutes ? `${zone.etaMinutes[0]}–${zone.etaMinutes[1]} min` : null;
}
