/**
 * TEXTOS EDITABLES DE LA WEB.
 * Nada aquí afirma historia, trayectoria ni datos operativos: el estado
 * comercial (abierto, horarios…) vive en `restaurant.storefront`.
 * Dos experiencias de compra, siempre con el mismo nombre:
 *   - "Platos preparados": la carta del restaurante (precios en CUP).
 *   - "Carnes para cocinar": cortes, embutidos y combos crudos para la parrilla de casa (precios en USD).
 */
export const content = {
  hero: {
    eyebrow: "Fuego Lento · Steakhouse",
    title: "El fuego pone el sabor. Tú eliges dónde disfrutarlo.",
    description: "Pide nuestros platos preparados o descubre cortes para cocinar en casa.",
    primaryCta: "Ver platos preparados",
    secondaryCta: "Comprar carnes para cocinar",
    image: { src: "/img/hero-costillas.webp", alt: "Costillar a la brasa sobre tabla de madera con tomate, papas gratinadas y encurtidos" },
    /** Cuando no se reciben pedidos */
    closed: {
      title: "Volvemos a encender el fuego",
      description: "Estamos preparando nuestro regreso. Mientras tanto, puedes consultar la carta y seguirnos para conocer las novedades.",
      exploreCta: "Ver platos preparados",
      meatCta: "Ver carnes para cocinar",
      signupCta: "Avísame cuando vuelvan",
      instagramCta: "Seguir en Instagram",
    },
  },

  /** Platos preparados: carta del restaurante */
  menu: {
    eyebrow: "La carta",
    title: "Platos preparados",
    description: "Explora la carta y elige cómo disfrutar cada plato.",
    pageDescription: "Entrantes, platos principales, postres y bebidas de la carta, con precios en CUP. Elige y envía tu pedido por WhatsApp.",
    featuredLabel: "Selección de la casa",
    allCta: "Ver toda la carta",
    noResults: "No encontramos ese plato. Prueba con otra búsqueda o explora las categorías.",
    catalogNote: "Carta de consulta: ahora mismo no estamos recibiendo pedidos.",
    unavailableTitle: "La carta se publicará pronto",
    unavailableText: "Estamos preparando nuestra carta. Síguenos en Instagram para conocer las novedades.",
    emptyCategory: "Esta categoría no tiene platos por ahora. Prueba con otra.",
    otherExperience: { text: "¿Prefieres cocinar en casa?", cta: "Ver carnes para cocinar", href: "/carnes/" },
  },

  /** Carnes para cocinar: tarjetas de portada y página /carnes */
  meat: {
    eyebrow: "Para cocinar en casa",
    title: "Carnes para cocinar en casa",
    description: "Explora cortes porcionados, embutidos y combos para tu parrilla.",
    allCta: "Ver todas las carnes",
    from: "Desde",
    page: {
      title: "Carnes para cocinar en casa",
      description: "Cortes porcionados, embutidos y combos para tu parrilla. Se entregan crudos; los precios van en USD, con su equivalente aproximado en CUP.",
      combosTitle: "Combos",
      combosDescription: "Elige un combo para 2 o para 4 personas. Cada uno muestra su contenido y el precio de las piezas por separado.",
      groups: { 2: "Combos para 2 personas", 4: "Combos para 4 personas" },
      blurbs: {
        steaks: "Precio por pieza. El peso va indicado en cada porción.",
        cortes: "Porciones de peso fijo y piezas que se cobran por kg: en estas, el importe del pedido es una estimación hasta pesar la pieza.",
        embutidos: "Precio por paquete.",
      } as Record<string, string>,
      note: "Precios en USD; el equivalente en CUP es aproximado y se confirma al responder tu pedido. Las piezas que se cobran por kg se pagan según el peso real. Ribeye EXPORT y tapa de solomillo son piezas de peso variable. Precios y disponibilidad pueden cambiar.",
      otherExperience: { text: "¿Prefieres recibirlo ya preparado?", cta: "Ver platos preparados", href: "/menu/" },
    },
  },

  /** "Cómo pedir": tres pasos */
  howToOrder: {
    title: "Cómo pedir",
    steps: [
      { title: "Elige tus productos", text: "Explora los platos preparados o las carnes para cocinar." },
      { title: "Revisa tu pedido", text: "Comprueba cantidades, opciones e importes antes de enviarlo." },
      { title: "Envía tu solicitud por WhatsApp", text: "El equipo confirmará disponibilidad, entrega y pago." },
    ],
    weightNote: "En las piezas que se cobran por kg, el importe final depende del peso real.",
  },

  specialties: {
    eyebrow: "Platos preparados",
    title: "Especialidades de la parrilla",
    description: "Cortes y brocheta de la carta, servidos a la parrilla. Abre uno para elegir el término de cocción, la salsa y las guarniciones.",
  },

  testimonials: { title: "Lo que dicen quienes ya pidieron" },

  delivery: {
    eyebrow: "Entrega y recogida",
    title: "Hasta dónde llega el fuego",
    description: "Recibe tu pedido en casa o pásalo a recoger al local.",
    homeTitle: "Entrega a domicilio",
    homeText: "Indica tu dirección al preparar el pedido. El equipo confirma por WhatsApp si llegamos a tu zona y cuánto cuesta el envío.",
    pickupTitle: "Recogida en el local",
    pickupText: "Recoge tu pedido en el local, sin costo de envío.",
    paymentTitle: "Pago",
    paymentText: "El método de pago se coordina por WhatsApp al confirmar tu pedido.",
    pausedTitle: "Pedidos",
    closedText: "Ahora no estamos recibiendo pedidos. Puedes consultar la carta y las carnes, y seguirnos para conocer la reapertura.",
  },

  /** Texto de seguridad para alérgenos */
  allergyNotice:
    "Los alérgenos que ves aquí son orientativos: se deducen de los ingredientes que cita la carta y no incluyen trazas. Si tienes una alergia o restricción alimentaria, indícalo por WhatsApp antes de enviar tu pedido y el restaurante te lo confirmará.",

  finalCta: {
    closed: { title: "Síguenos mientras volvemos", description: "Las novedades y la fecha de reapertura se anuncian en Instagram.", cta: "Seguir en Instagram" },
  },

  footer: {
    description: "Steakhouse en el Vedado, La Habana. Platos preparados y carnes para cocinar.",
  },
};
