import type { DeliveryZone } from "@/types/restaurant";

/**
 * DEMO · Zonas de ejemplo. Sustituir por los repartos/municipios reales,
 * con su costo y tiempo, antes de publicar.
 */
export const deliveryZones: DeliveryZone[] = [
  {
    id: "zona-1",
    name: "Zona 1 · cercana",
    description: "Repartos próximos al restaurante (ejemplo)",
    fee: 300,
    etaMinutes: [35, 50],
    available: true,
  },
  {
    id: "zona-2",
    name: "Zona 2 · intermedia",
    description: "Repartos a distancia media (ejemplo)",
    fee: 500,
    etaMinutes: [45, 65],
    available: true,
  },
  {
    id: "zona-3",
    name: "Zona 3 · extendida",
    description: "Municipios más alejados (ejemplo)",
    fee: 800,
    minOrder: 6000,
    etaMinutes: [60, 80],
    available: true,
  },
];
