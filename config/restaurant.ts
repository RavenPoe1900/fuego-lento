import type { BusinessHours, PaymentMethod, StorefrontConfig } from "@/types/restaurant";

/**
 * CONFIGURACIÓN CENTRAL DEL RESTAURANTE
 *
 * Todo dato comercial vive aquí. Los valores `null` están PENDIENTES de que
 * Fuego Lento los confirme: mientras sean null, la web no los muestra.
 * Los valores marcados como DEMO son de ejemplo y deben reemplazarse antes de publicar.
 */
export const restaurant = {
  /** true mientras existan productos, precios, horarios o zonas de ejemplo */
  isDemoContent: true,

  /**
   * ESTADO COMERCIAL (solo valores confirmados).
   * Confirmado públicamente (Instagram): cerrado temporalmente por reparaciones.
   * Menú, precios, horarios y cobertura aún no han sido proporcionados.
   */
  storefront: {
    status: "temporarily_closed",
    statusMessage: "Temporalmente cerrado por reparaciones",
    orderingEnabled: false,
    hoursStatus: "unavailable",
    coverageEnabled: false,
    historyApproved: false,
    faqRouteEnabled: true,
    menuApproved: false,
    pricesConfirmed: false,
    reopeningSignupEnabled: false,
    whatsappOrderingEnabled: false,
    paymentMethodsConfirmed: false,
  } satisfies StorefrontConfig as StorefrontConfig,

  name: "Fuego Lento Steakhouse",
  shortName: "Fuego Lento",
  tagline: "Steakhouse · Cortes y carnes",

  country: "Cuba",
  timezone: "America/Havana",
  /** PENDIENTE */
  city: null as string | null,
  /** PENDIENTE */
  address: null as string | null,
  /** PENDIENTE */
  phone: null as string | null,
  /** PENDIENTE */
  email: null as string | null,
  /** Número en formato internacional sin "+" ni espacios, p. ej. 53XXXXXXXX. Se lee del entorno. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null,

  instagram: {
    handle: "@fuegolento_steakhouse",
    url: "https://www.instagram.com/fuegolento_steakhouse",
  },

  reopening: {
    /** Fecha confirmada ISO (YYYY-MM-DD). Sin fecha, no se muestra contador. */
    date: null as string | null,
  },

  /** PENDIENTE confirmar moneda de venta (CUP / USD) */
  currency: { code: "CUP", locale: "es-CU" },
  /** PENDIENTE confirmar si los precios incluyen impuestos */
  pricesIncludeTax: true,
  /** Cargo por servicio en porcentaje. 0 = no existe (no se muestra) */
  serviceFeePercent: 0,

  ordering: {
    deliveryEnabled: true,
    pickupEnabled: true,
    scheduledEnabled: true,
    /** Aceptar pedidos programados mientras está cerrado */
    allowScheduledWhenClosed: true,
    /** DEMO · pedido mínimo global */
    minOrder: 2500 as number | null,
    /** DEMO · tiempo mínimo de preparación */
    minPrepMinutes: 45,
    slotMinutes: 30,
    /** Última hora para aceptar pedidos antes del cierre */
    lastOrderMinutesBeforeClose: 30,
    maxDaysAhead: 2,
    maxNoteLength: 140,
    emailRequired: false,
    lastNameRequired: false,
  },

  /** DEMO · horario de ejemplo, sin confirmar. Solo se muestra si storefront.hoursStatus === "confirmed". */
  hours: [
    { day: 0, enabled: true, intervals: [{ open: "12:00", close: "22:00" }] },
    { day: 1, enabled: false, intervals: [] },
    { day: 2, enabled: true, intervals: [{ open: "12:00", close: "22:00" }] },
    { day: 3, enabled: true, intervals: [{ open: "12:00", close: "22:00" }] },
    { day: 4, enabled: true, intervals: [{ open: "12:00", close: "22:00" }] },
    { day: 5, enabled: true, intervals: [{ open: "12:00", close: "23:00" }] },
    { day: 6, enabled: true, intervals: [{ open: "12:00", close: "23:00" }] },
  ] satisfies BusinessHours[],
  /** Días cerrados por feriado (YYYY-MM-DD) */
  holidays: [] as string[],

  /** DEMO · métodos habituales en Cuba, pendientes de confirmación */
  paymentMethods: [
    {
      id: "cash-on-delivery",
      label: "Efectivo al recibir",
      description: "Pagas al repartidor cuando llega tu pedido.",
      enabled: true,
      deliveryMethods: ["delivery"],
    },
    {
      id: "transfer",
      label: "Transferencia",
      description: "Transfermóvil o EnZona. Te enviamos los datos al confirmar.",
      enabled: true,
      deliveryMethods: ["delivery", "pickup"],
    },
    {
      id: "pay-on-pickup",
      label: "Pago al recoger",
      description: "Pagas en el restaurante al recoger tu pedido.",
      enabled: true,
      deliveryMethods: ["pickup"],
    },
    {
      id: "online",
      label: "Pago en línea",
      description: "Requiere una pasarela de pago configurada.",
      enabled: false,
      deliveryMethods: ["delivery", "pickup"],
    },
  ] as PaymentMethod[],

  seo: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://fuegolento.example",
    title: "Fuego Lento Steakhouse · Pedidos a domicilio",
    description:
      "Cortes, hamburguesas y especialidades preparadas con fuego, tiempo y carácter. Pide Fuego Lento a domicilio o para recoger.",
    ogImage: "/img/demo/hero.jpg",
  },
};

export type RestaurantConfig = typeof restaurant;
