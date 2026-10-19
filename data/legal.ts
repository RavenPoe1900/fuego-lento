import { restaurant } from "@/config/restaurant";

export type LegalSection = { heading: string; body: string[] };
export type LegalPage = { title: string; intro: string; sections: LegalSection[] };

/** Fecha de la última revisión del texto, tal como se muestra. */
export const LEGAL_UPDATED = "octubre de 2026";

/** Aviso que acompaña a cada documento mientras no lo haya revisado un profesional. */
export const LEGAL_REVIEW_NOTE =
  "Texto redactado a partir de cómo funciona hoy esta web. Está pendiente de revisión legal por el restaurante antes de considerarse definitivo.";

const business = `${restaurant.name}, ${[restaurant.address, restaurant.city].filter(Boolean).join(", ")}`;
const whatsapp = `+${restaurant.whatsapp}`;

/**
 * Textos legales. Describen únicamente lo que la web hace: no hay cuentas de usuario, ni pagos en línea,
 * ni servidor que reciba pedidos; el pedido se envía por WhatsApp y lo confirma el restaurante.
 */
export const legalPages: Record<string, LegalPage> = {
  privacidad: {
    title: "Aviso de privacidad",
    intro: `Este aviso explica qué datos usa la web de ${restaurant.name} y para qué.`,
    sections: [
      {
        heading: "Qué datos usamos",
        body: [
          "Solo los que escribes al preparar tu pedido: tu nombre, tu dirección si eliges entrega a domicilio, las notas y los productos que añades. No pedimos cuenta, contraseña ni datos de pago.",
        ],
      },
      {
        heading: "Dónde se guardan",
        body: [
          "Para que no pierdas tu pedido al recargar la página, los guardamos en este dispositivo, en el almacenamiento local de tu navegador. La web no los envía a ningún servidor propio.",
          "Puedes borrarlos con «Vaciar pedido» o eliminando los datos del sitio desde tu navegador.",
        ],
      },
      {
        heading: "Cuándo salen de tu dispositivo",
        body: [
          `Solo cuando pulsas «Enviar pedido por WhatsApp»: el resumen se abre en WhatsApp y lo envías tú al número ${whatsapp}. A partir de ahí, WhatsApp trata los datos según su propia política.`,
          "Los enlaces a Instagram y a mapas se abren en sitios externos con sus propias políticas.",
        ],
      },
      {
        heading: "Para qué los usamos",
        body: ["Únicamente para que el restaurante pueda preparar, confirmar y entregar tu pedido."],
      },
      {
        heading: "Tus derechos y contacto",
        body: [`Si quieres consultar o eliminar los datos que nos enviaste por WhatsApp, escríbenos al ${whatsapp}. Responsable: ${business}.`],
      },
    ],
  },
  terminos: {
    title: "Términos del servicio",
    intro: `Condiciones para usar la web de ${restaurant.name} y enviar solicitudes de pedido.`,
    sections: [
      {
        heading: "Qué es esta web",
        body: [
          "Es una carta con precios y una herramienta para preparar tu pedido. La web no cobra ni confirma pedidos: genera un resumen y lo envías por WhatsApp.",
          "Tu pedido queda confirmado cuando el restaurante te lo confirma por WhatsApp, no al abrir la aplicación.",
        ],
      },
      {
        heading: "Platos preparados y carnes para cocinar",
        body: [
          "Los platos preparados son los de la carta del restaurante y sus precios van en CUP. Las carnes para cocinar se entregan crudas y sus precios van en USD, con un equivalente en CUP aproximado.",
          "Puedes combinar ambos en un mismo pedido; cada tipo mantiene su moneda.",
        ],
      },
      {
        heading: "Precios y disponibilidad",
        body: [
          "Los precios y la disponibilidad pueden cambiar. El restaurante confirma la disponibilidad al responder tu pedido.",
          "Las piezas que se cobran por kg se pagan según su peso real: el importe del pedido es una estimación hasta pesarlas.",
        ],
      },
      {
        heading: "Entrega, recogida y pago",
        body: [
          "Puedes elegir entrega a domicilio o recogida en el local. El coste del envío y si llegamos a tu zona se confirman por WhatsApp.",
          "El método de pago se coordina por WhatsApp al confirmar el pedido.",
        ],
      },
      {
        heading: "Contacto",
        body: [`${business}. WhatsApp: ${whatsapp}.`],
      },
    ],
  },
  pedidos: {
    title: "Política de pedidos",
    intro: "Cómo funciona un pedido desde que lo preparas hasta que lo recibes.",
    sections: [
      {
        heading: "Cómo se envía y se confirma",
        body: [
          "Preparas tu pedido en la web y lo envías por WhatsApp. El restaurante confirmará la disponibilidad, la entrega y el pago por ese chat.",
          "Hasta que recibas esa confirmación, tu pedido es una solicitud.",
        ],
      },
      {
        heading: "Modificar o cancelar",
        body: [
          "Puedes modificar o cancelar tu pedido por WhatsApp mientras el restaurante no lo haya confirmado.",
          "Una vez confirmado, cualquier cambio debe acordarse con el restaurante.",
        ],
      },
      {
        heading: "Si hay un problema",
        body: [`Si falta un producto o algo no es como esperabas, escríbenos al ${whatsapp} cuanto antes para que el equipo lo revise contigo.`],
      },
      {
        heading: "Horario de pedidos",
        body: ["Los pedidos se envían dentro del horario del local. Fuera de horario puedes preparar tu pedido y enviarlo cuando abramos."],
      },
    ],
  },
  alergenos: {
    title: "Información sobre alérgenos",
    intro: "Cómo leer la información de alérgenos de cada plato.",
    sections: [
      {
        heading: "Qué mostramos",
        body: [
          "En la ficha de cada producto indicamos los alérgenos que se deducen de los ingredientes que cita la carta, por ejemplo gluten, lácteos, huevo o mariscos.",
          "Es una orientación: no incluye trazas ni contaminación cruzada, y puede no recoger ingredientes que la carta no menciona.",
        ],
      },
      {
        heading: "Si tienes una alergia o restricción",
        body: [
          `Indícalo por WhatsApp (${whatsapp}) antes de enviar tu pedido. El restaurante debe confirmarte los alérgenos y el manejo de cada plato.`,
          "Si un plato no muestra alérgenos, no significa que sea seguro: confírmalo igualmente.",
        ],
      },
      {
        heading: "Guarniciones, salsas y extras",
        body: ["Las guarniciones y salsas que eliges pueden añadir otros alérgenos. Cada opción muestra los suyos cuando se deducen de su descripción."],
      },
    ],
  },
};
