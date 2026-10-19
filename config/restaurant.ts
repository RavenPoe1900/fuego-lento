import type { BusinessHours, StorefrontConfig } from "@/types/restaurant";

/**
 * CONFIGURACIÓN CENTRAL DEL RESTAURANTE
 *
 * Todo dato comercial vive aquí. Los valores `null` están PENDIENTES de que
 * Fuego Lento los confirme: mientras sean null, la web no los muestra.
 * Los valores marcados como DEMO son de ejemplo y deben reemplazarse antes de publicar.
 */
export const restaurant = {
  /**
   * ESTADO COMERCIAL: única fuente de verdad. Todo lo que la web muestra o permite sale de aquí.
   * Confirmado por el negocio (oct. 2026): abierto y recibiendo pedidos por WhatsApp.
   * Para cerrar por reparaciones: status "temporarily_closed" + orderingEnabled false + whatsappOrderingEnabled false.
   * Menú, precios y horario: carta pública en Carrta (carrta.app/fuegolento).
   */
  storefront: {
    status: "open",
    statusMessage: "",
    orderingEnabled: true,
    hoursStatus: "confirmed",
    historyApproved: false,
    faqRouteEnabled: true,
    menuApproved: true,
    pricesConfirmed: true,
    reopeningSignupEnabled: false,
    whatsappOrderingEnabled: true,
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
  /**
   * Cambio para convertir a CUP los productos fijados en USD (Carnes a domicilio).
   * PENDIENTE: confirmar la tasa con el restaurante. El entorno puede sobrescribirla.
   */
  fx: { usdToCup: Number(process.env.NEXT_PUBLIC_USD_CUP_RATE) || 450 },
  /** Cargo por servicio en porcentaje. 0 = no existe (no se muestra) */
  serviceFeePercent: 0,

  ordering: {
    deliveryEnabled: true,
    pickupEnabled: true,
    /** Sin horas de corte: se acepta pedido mientras el local está abierto */
    lastOrderMinutesBeforeClose: 0,
    maxNoteLength: 140,
  },

  /** Horario real según su carta en Carrta: todos los días de 12:30 a 19:00. */
  hours: [0, 1, 2, 3, 4, 5, 6].map((day) => ({ day, enabled: true, intervals: [{ open: "12:30", close: "19:00" }] })) satisfies BusinessHours[],
  /** Días cerrados por feriado (YYYY-MM-DD) */
  holidays: [] as string[],

  seo: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://fuegolento.example",
    title: "Fuego Lento Steakhouse · Pedidos a domicilio",
    description:
      "Cortes Angus a la parrilla, entrantes, vinos y cócteles en el Vedado, La Habana. Pide Fuego Lento a domicilio o para recoger.",
    ogImage: "/img/menu/header-2.webp",
  },
};

export type RestaurantConfig = typeof restaurant;
