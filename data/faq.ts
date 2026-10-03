import { content } from "@/config/content";
import { restaurant } from "@/config/restaurant";
import { deliveryZones } from "@/data/delivery-zones";
import { isPreview } from "@/lib/dev";
import { hoursSummary } from "@/lib/schedule";
import type { Storefront } from "@/lib/storefront";
import type { FaqItem } from "@/types/restaurant";

/**
 * Las respuestas se derivan de la configuración y del estado comercial: solo
 * existen cuando el dato que describen está confirmado. Nunca hay placeholders.
 */
export function getFaq(sf: Storefront): FaqItem[] {
  const open = hoursSummary().filter((h) => h.text !== "Cerrado");
  const zones = deliveryZones.filter((z) => z.available);
  const payments = restaurant.paymentMethods.filter((p) => p.enabled).map((p) => p.label.toLowerCase());
  const ordering = sf.orderingEnabled;

  const all: FaqItem[] = [
    {
      id: "horario",
      question: "¿Cuál es el horario de pedidos?",
      answer: sf.showHours && open.length ? `Atendemos pedidos ${open.map((h) => `${h.day.toLowerCase()} de ${h.text.replace(" – ", " a ")}`).join("; ")}.` : null,
    },
    {
      id: "zonas",
      question: "¿Qué zonas tienen entrega?",
      answer: sf.showDelivery && zones.length ? `Entregamos en ${zones.length} ${zones.length === 1 ? "zona" : "zonas"}. Elige la tuya en la sección de cobertura para ver el costo del envío y el tiempo estimado antes de pedir.` : null,
    },
    {
      id: "recogida",
      question: "¿Puedo recoger mi pedido?",
      answer: ordering && restaurant.ordering.pickupEnabled ? "Sí. Al finalizar el pedido puedes elegir recogida en el restaurante, sin costo de envío." : null,
    },
    {
      id: "coccion",
      question: "¿Cómo elijo el término de cocción?",
      answer: ordering ? "Al abrir un corte verás los términos disponibles para ese producto. Elige el que prefieras antes de añadirlo; aparecerá en el carrito y en el resumen del pedido." : null,
    },
    {
      id: "pagos",
      question: "¿Qué métodos de pago están disponibles?",
      answer: ordering && payments.length ? `Puedes pagar con: ${payments.join(", ")}. Los métodos disponibles dependen de si eliges entrega o recogida.` : null,
    },
    { id: "modificar", question: "¿Cómo modifico o cancelo un pedido?", answer: null },
    { id: "alergias", question: "¿Cómo se gestionan las alergias?", answer: isPreview ? content.allergyNotice : null },
    {
      id: "cargos",
      question: "¿Los precios incluyen cargos de entrega?",
      answer: sf.showDelivery ? "Los precios del menú no incluyen el envío. El costo según tu zona se muestra antes de confirmar el pedido." : null,
    },
  ];
  return all.filter((f) => f.answer !== null);
}

/** La ruta /preguntas-frecuentes solo se enlaza si hay al menos una respuesta confirmada. */
export function faqAvailable(sf: Storefront): boolean {
  return sf.config.faqRouteEnabled && getFaq(sf).length > 0;
}
