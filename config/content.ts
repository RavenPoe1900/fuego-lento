/**
 * TEXTOS EDITABLES DE LA WEB.
 * Nada aquí afirma historia, trayectoria ni datos operativos: el estado
 * comercial (abierto, horarios, cobertura…) vive en `restaurant.storefront`.
 */
export const content = {
  hero: {
    eyebrow: "Steakhouse · Cortes & carnes",
    title: "De las brasas a tu puerta",
    description: "Cortes Angus, parrilla y especialidades preparadas al fuego.",
    primaryCta: "Explorar el menú",
    coverageLink: "Consultar cobertura",
    image: { src: "/img/hero-costillas.webp", alt: "Costillar a la brasa sobre tabla de madera con tomate, papas gratinadas y encurtidos" },
    /** Cuando no se reciben pedidos */
    closed: {
      title: "Volvemos a encender el fuego",
      description: "Estamos preparando nuestro regreso. Mientras tanto, síguenos para conocer las novedades.",
      exploreCta: "Explorar el menú",
      signupCta: "Avísame cuando vuelvan",
      instagramCta: "Seguir en Instagram",
    },
  },

  /** Pausa tipográfica: palabras clave, sin afirmaciones. PENDIENTE de revisión de copy. */
  pause: ["Fuego.", "Corte.", "Tiempo."],
  pauseLabel: "Cocina de fuego",

  /** Carnes a domicilio: tarjetas de portada y página /carnes */
  meat: {
    eyebrow: "Carnes a domicilio",
    title: "Carne premium, directo a tu parrilla",
    description: "Cortes porcionados en Fuego Lento y combos para 2 o 4. Precios en USD, con su equivalente en CUP.",
    allCta: "Ver toda la lista",
    from: "Desde",
    page: {
      title: "Carnes premium a domicilio",
      description: "Lista de precios de Fuego Lento. Elige tus cortes y envía tu pedido por WhatsApp.",
      combosTitle: "Combos",
      combosDescription: "Arma tu parrillada y ahorra con nuestros combos.",
      groups: { 2: "Cenas para dos", 4: "Para la familia y los amigos" },
      note: "Precios en USD; el equivalente en CUP es aproximado y depende del cambio del día. Los cortes vendidos por kg se cobran según el peso real de la pieza. Ribeye EXPORT y tapa de solomillo son piezas de peso variable. Precios y disponibilidad sujetos a cambio sin previo aviso.",
    },
  },

  /** "Cómo pedir": tres pasos sobre fondo claro */
  howToOrder: {
    title: "Cómo pedir",
    labels: ["Carne premium", "Directo a tu puerta"],
    steps: [
      { title: "Elige tu corte", text: "Recorre steaks, cortes de la casa, embutidos y combos. Cada precio va en USD, con su equivalente en CUP al lado." },
      { title: "Confirma por WhatsApp", text: "Arma tu pedido y envíalo como comanda. Te confirmamos disponibilidad y, en las piezas por kg, el peso real." },
      { title: "Recíbelo en casa", text: "Coordinamos la entrega a tu zona y el pago al confirmar. Las piezas por kg se cobran según su peso real." },
    ],
    image: { src: "/img/hero-costillas.webp", alt: "Costillar a la brasa sobre tabla de madera" },
  },

  specialties: {
    eyebrow: "Especialidades",
    title: "Lo que pasa por las brasas",
    description: "Piezas pensadas para el fuego. Abre una para ver ingredientes y opciones.",
  },

  testimonials: { title: "Lo que dicen quienes ya pidieron" },

  menu: {
    title: "Elige lo que enciende tu apetito",
    description: "Explora la carta y personaliza cada plato.",
    noResults: "No encontramos ese plato. Prueba con otra búsqueda o explora las categorías.",
    catalogNote: "Menú de consulta: ahora mismo no estamos recibiendo pedidos.",
    unavailableTitle: "El menú se publicará pronto",
    unavailableText: "Estamos preparando nuestra carta. Síguenos en Instagram para conocer las novedades.",
  },

  coverage: {
    title: "Hasta dónde llega el fuego",
    description: "Elige tu zona para conocer el costo de envío y el tiempo estimado.",
    closedTitle: "Estado del servicio",
    closedText: "Cuando volvamos a recibir pedidos, aquí podrás comprobar si entregamos en tu zona.",
  },

  /** Respuestas null = pendientes de aprobación del restaurante */
  packaging: {
    title: "Así llega tu pedido",
    items: [
      { id: "empaque", question: "¿Cómo se empaca la comida?", answer: null },
      { id: "salsas", question: "¿Cómo viajan las salsas y acompañamientos?", answer: null },
      { id: "consumo", question: "Recomendaciones de consumo y recalentado", answer: null },
      { id: "faltante", question: "¿Qué hago si falta un producto?", answer: null },
    ],
  },

  /** Texto de seguridad: debe aprobarlo el restaurante antes de mostrarse al público. */
  allergyNotice:
    "Si tienes alguna alergia o restricción alimentaria, indícalo antes de confirmar tu pedido. La disponibilidad y el manejo deben ser confirmados por el restaurante.",

  cookingGuide:
    "Guía orientativa: poco hecho (centro rojo y jugoso), medio (centro rosado), tres cuartos (apenas rosado), bien hecho (sin rosado).",

  finalCta: {
    open: { title: "Hoy se come al fuego", description: "Elige tus favoritos y lleva la experiencia Fuego Lento a tu mesa.", cta: "Comenzar pedido", secondary: "Comprobar cobertura" },
    closed: { title: "Síguenos mientras volvemos", description: "Las novedades y la fecha de reapertura se anuncian en Instagram.", cta: "Seguir en Instagram" },
  },

  footer: {
    description: "Steakhouse especializado en cortes y carnes.",
  },
};
