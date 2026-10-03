/**
 * TEXTOS EDITABLES DE LA WEB.
 * Nada aquí afirma historia, trayectoria ni datos operativos: el estado
 * comercial (abierto, horarios, cobertura…) vive en `restaurant.storefront`.
 */
export const content = {
  hero: {
    eyebrow: "Steakhouse · Cortes & carnes",
    title: "De las brasas a tu puerta",
    description: "Cortes, hamburguesas y especialidades preparadas al fuego.",
    primaryCta: "Explorar el menú",
    coverageLink: "Consultar cobertura",
    image: { src: "/img/demo/hero.jpg", alt: "Corte de res a la brasa rebanado sobre una tabla de madera" },
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
    label: "Manifiesto",
    title: "El sabor no se improvisa.",
    text: "Cortes, hamburguesas y especialidades preparados al fuego",
    textOrdering: " y personalizados para cada pedido.",
  },

  /** Pausa tipográfica: palabras clave, sin afirmaciones. */
  pause: ["Fuego.", "Corte.", "Tiempo."],

  families: {
    title: "Elige tu punto de partida",
    description: "Cinco familias, una misma cocina de fuego.",
  },

  specialties: {
    eyebrow: "Especialidades",
    title: "Lo que pasa por las brasas",
    description: "Piezas pensadas para el fuego. Abre una para ver ingredientes y opciones.",
  },

  /** Secuencia visual: palabras sueltas, sin afirmaciones. */
  experience: {
    srTitle: "Del fuego a la mesa",
    panels: [
      { word: "Brasas", image: { src: "/img/demo/social-costillas.jpg", alt: "Costillas ahumadas recién cortadas sobre una tabla" } },
      { word: "Corte", image: { src: "/img/demo/corte-rebanado.jpg", alt: "Corte de res jugoso cortado con cuchillo y tenedor" } },
      { word: "Mesa", image: { src: "/img/demo/social-mesa.jpg", alt: "Mesa con brochetas, vegetales asados y salsas" } },
    ],
  },

  community: {
    title: "Una comunidad encendida",
    description: "Platos, momentos y experiencias compartidas alrededor de Fuego Lento.",
    cta: "Ver Instagram",
    images: [
      { src: "/img/demo/barra.jpg", alt: "Barra de un restaurante con iluminación cálida" },
      { src: "/img/demo/trago.jpg", alt: "Cóctel ámbar con hielo y piel de naranja sobre la barra" },
      { src: "/img/demo/coctel.jpg", alt: "Cóctel con romero y rodaja de cítrico sobre madera" },
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
