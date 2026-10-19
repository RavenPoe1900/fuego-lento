import { content } from "@/config/content";
import { restaurant } from "@/config/restaurant";
import { hoursLine, hoursSummary } from "@/lib/schedule";
import type { Storefront } from "@/lib/storefront";
import type { FaqItem } from "@/types/restaurant";

/**
 * Las respuestas describen cómo funciona la web hoy (pedido por WhatsApp, confirmación manual) y los datos
 * confirmados del negocio. Las que dependen de que se reciban pedidos solo existen cuando se reciben.
 */
export function getFaq(sf: Storefront): FaqItem[] {
  const ordering = sf.orderingEnabled;
  const simple = hoursLine();
  const hours = simple
    ? simple.replace("Todos los días · ", "todos los días de ").replace("–", " a ")
    : hoursSummary()
        .filter((h) => h.text !== "Cerrado")
        .map((h) => `${h.day.toLowerCase()} de ${h.text.replace(" – ", " a ")}`)
        .join("; ");
  const address = [restaurant.address, restaurant.city].filter(Boolean).join(", ");

  const all: (FaqItem | false)[] = [
    {
      id: "diferencia",
      question: "¿Qué diferencia hay entre platos preparados y carnes para cocinar?",
      answer:
        "Los platos preparados son los de la carta, que cocina el restaurante: sus precios van en CUP. Las carnes para cocinar son cortes, embutidos y combos crudos que compras para preparar en casa: sus precios van en USD, con un equivalente aproximado en CUP.",
    },
    ordering && {
      id: "confirmacion",
      question: "¿Cómo se confirma mi pedido?",
      answer:
        "La web prepara un resumen de tu pedido y abre WhatsApp para que lo envíes. Abrir WhatsApp no confirma el pedido: el equipo confirmará la disponibilidad, la entrega y el pago por ese mismo chat.",
    },
    ordering && {
      id: "mixto",
      question: "¿Puedo pedir platos preparados y carnes en un mismo pedido?",
      answer: "Sí. En tu pedido verás un subtotal para cada tipo, en su propia moneda: CUP para los platos preparados y USD para las carnes para cocinar.",
    },
    {
      id: "peso",
      question: "¿Cómo se cobran las piezas por peso?",
      answer:
        "Algunas piezas se cobran por kg, como el Ribeye EXPORT, la tapa de solomillo o los tomahawk. Se cobran según el peso real de la pieza, así que el importe del pedido es una estimación hasta que se pesa.",
    },
    {
      id: "coccion",
      question: "¿Puedo elegir el término de cocción?",
      answer:
        "Sí, en los cortes de la carta a la parrilla eliges entre poco hecho, medio, tres cuartos y bien hecho antes de añadirlos. En las carnes para cocinar no aplica, porque se entregan crudas.",
    },
    ordering && {
      id: "entrega",
      question: "¿Cómo sé si entregan en mi zona y cuánto cuesta el envío?",
      answer:
        "Escribe tu dirección al preparar el pedido. Mientras tanto el envío aparece como «se confirma por WhatsApp»: el equipo te dirá si llegamos a tu zona y el coste antes de cerrar el pedido.",
    },
    ordering && restaurant.ordering.pickupEnabled && {
      id: "recogida",
      question: "¿Puedo recoger mi pedido en el local?",
      answer: `Sí. Elige «Recoger en el local» al preparar el pedido. Estamos en ${address}. La recogida no tiene costo de envío.`,
    },
    sf.showHours && hours
      ? { id: "horario", question: "¿Cuál es el horario?", answer: `Atendemos ${hours}.` }
      : false,
    ordering && {
      id: "pagos",
      question: "¿Cómo se paga?",
      answer: "El método de pago se coordina por WhatsApp al confirmar tu pedido.",
    },
    ordering && {
      id: "modificar",
      question: "¿Cómo modifico o cancelo un pedido?",
      answer:
        "Escríbenos por WhatsApp. Puedes modificar o cancelar tu pedido mientras el restaurante no lo haya confirmado; una vez confirmado, cualquier cambio debe acordarse con el restaurante.",
    },
    {
      id: "alergias",
      question: "¿Dónde consulto los alérgenos?",
      answer: `${content.allergyNotice} Cada plato muestra su lista en su ficha, y hay más información en la página de alérgenos.`,
    },
  ];
  return all.filter((f): f is FaqItem => Boolean(f) && (f as FaqItem).answer !== null);
}

/** La ruta /preguntas-frecuentes solo se enlaza si hay al menos una respuesta confirmada. */
export function faqAvailable(sf: Storefront): boolean {
  return sf.config.faqRouteEnabled && getFaq(sf).length > 0;
}
