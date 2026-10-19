/** Estado comercial público de la tienda */
export type StoreStatus = "open" | "temporarily_closed" | "coming_soon";

/** confirmed: horarios oficiales · pending: sin confirmar (no se muestran) · unavailable: no se reciben pedidos */
export type HoursStatus = "confirmed" | "pending" | "unavailable";

/**
 * Única fuente de verdad de lo que la web puede mostrar y permitir.
 * Ningún componente decide por su cuenta: todos leen esta configuración.
 */
export interface StorefrontConfig {
  status: StoreStatus;
  statusMessage: string;
  orderingEnabled: boolean;
  hoursStatus: HoursStatus;
  historyApproved: boolean;
  faqRouteEnabled: boolean;
  /** Menú (nombres, fotos, descripciones) aprobado por el restaurante */
  menuApproved: boolean;
  pricesConfirmed: boolean;
  /** Solo true si existe un mecanismo real que reciba los registros */
  reopeningSignupEnabled: boolean;
  /** El canal de pedido es WhatsApp: debe estar habilitado explícitamente */
  whatsappOrderingEnabled: boolean;
}

export type TimeInterval = {
  /** "HH:MM" en la zona horaria del restaurante */
  open: string;
  close: string;
};

export type BusinessHours = {
  /** 0 = domingo … 6 = sábado */
  day: number;
  enabled: boolean;
  intervals: TimeInterval[];
};

export type DeliveryMethod = "delivery" | "pickup";

export type FaqItem = {
  id: string;
  question: string;
  /** null = respuesta pendiente de que el negocio la apruebe */
  answer: string | null;
};
