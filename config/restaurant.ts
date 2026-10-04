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
   * Menú, precios y horario: tomados de su carta pública en Carrta (carrta.app/fuegolento). Cobertura aún pendiente.
   */
  storefront: {
    // TEMPORAL (vista previa del diseño): revertir a "temporarily_closed" / orderingEnabled false / whatsappOrderingEnabled false
    status: "open",
    statusMessage: "",
    orderingEnabled: true,
    hoursStatus: "confirmed",
    coverageEnabled: false,
    historyApproved: false,
    faqRouteEnabled: true,
    menuApproved: true,
    pricesConfirmed: true,
    reopeningSignupEnabled: false,
    whatsappOrderingEnabled: true,
    paymentMethodsConfirmed: false,
  } satisfies StorefrontConfig as StorefrontConfig,

  name: "Fuego Lento Steakhouse",
  shortName: "Fuego Lento",
  tagline: "Steakhouse · Cortes y carnes",

  country: "Cuba",
  timezone: "America/Havana",
  city: "La Habana" as string | null,
  /** Según su carta en Carrta (con enlace a Google Maps) */
  address: "Calle 1ra esquina C, Vedado" as string | null,
  /** PENDIENTE */
  phone: null as string | null,
  /** PENDIENTE */
  email: null as string | null,
  /** Número en formato internacional sin "+" ni espacios (53 + 8 dígitos). El entorno puede sobrescribirlo. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5358465895",

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

  /** Horario real según su carta en Carrta: todos los días de 12:30 a 19:00. */
  hours: [0, 1, 2, 3, 4, 5, 6].map((day) => ({ day, enabled: true, intervals: [{ open: "12:30", close: "19:00" }] })) satisfies BusinessHours[],
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
      "Cortes Angus a la parrilla, entrantes, vinos y cócteles en el Vedado, La Habana. Pide Fuego Lento a domicilio o para recoger.",
    ogImage: "/img/menu/header-2.webp",
  },
};

export type RestaurantConfig = typeof restaurant;
