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

  /** Texto editorial que describe la oferta sin afirmar historia, trayectoria ni datos. */
  manifesto: {
    label: "Oficio",
    title: "El sabor no se improvisa.",
    text: "Cortes Angus, parrilla y especialidades preparados al fuego",
    textOrdering: " y personalizados para cada pedido.",
    /**
     * Composición 5/4/3: foto de producto · texto · foto de ambiente.
     * Fotos reales del restaurante (carta de Carrta).
     */
    imagesApproved: true,
    images: [
      { src: "/img/menu/picana-angus-prime-230-grs.webp", alt: "Picaña Angus Prime rebanada con vegetales a la brasa" },
      { src: "/img/menu/gambones.webp", alt: "Comensal leyendo la carta de Fuego Lento junto a un plato de gambones" },
    ],
  },

  /** Pausa tipográfica: palabras clave, sin afirmaciones. PENDIENTE de revisión de copy. */
  pause: ["Fuego.", "Corte.", "Tiempo."],
  pauseLabel: "Cocina de fuego",

  families: {
    title: "Elige tu punto de partida",
    description: "Una misma cocina de fuego.",
  },

  specialties: {
    eyebrow: "Especialidades",
    title: "Lo que pasa por las brasas",
    description: "Piezas pensadas para el fuego. Abre una para ver ingredientes y opciones.",
  },

  /** Secuencia visual: palabras sueltas, sin afirmaciones. */
  experience: {
    eyebrow: "Secuencia",
    title: "Del fuego a la mesa",
    panels: [
      { word: "Brasas", image: { src: "/img/menu/t-bone-angus-prime-400-grs.webp", alt: "T-Bone Angus Prime con marcas de la parrilla" } },
      { word: "Corte", image: { src: "/img/menu/picana-angus-prime-460-grs.webp", alt: "Picaña Angus Prime rebanada con salsa y vegetales" } },
      { word: "Mesa", image: { src: "/img/menu/tabla-fuego-lento.webp", alt: "Tabla Fuego Lento servida en la mesa con una copa de vino" } },
      { word: "Plancha", image: { src: "/img/menu/churrasco-angus-prime-460-grs.webp", alt: "Churrasco Angus Prime sobre tabla de madera" } },
    ],
  },

  community: {
    title: "Una comunidad encendida",
    description: "Platos, momentos y experiencias compartidas alrededor de Fuego Lento.",
    cta: "Ver Instagram",
    images: [
      { src: "/img/menu/header-3.webp", alt: "Corte a la brasa con vegetales y copa de vino en la mesa" },
      { src: "/img/menu/filetillo-de-res.webp", alt: "Filetillo de res acompañado de un cóctel" },
      { src: "/img/menu/new-york-steak-angus-prime-350-grs.webp", alt: "New York Steak servido con vino tinto" },
    ],
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
