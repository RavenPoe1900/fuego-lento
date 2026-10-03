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
  coverageEnabled: boolean;
  historyApproved: boolean;
  faqRouteEnabled: boolean;
  /** Menú (nombres, fotos, descripciones) aprobado por el restaurante */
  menuApproved: boolean;
  pricesConfirmed: boolean;
  /** Solo true si existe un mecanismo real que reciba los registros */
  reopeningSignupEnabled: boolean;
  /** El canal de pedido es WhatsApp: debe estar habilitado explícitamente */
  whatsappOrderingEnabled: boolean;
  /** Métodos de pago confirmados por el restaurante (si false: "Pago: por coordinar") */
  paymentMethodsConfirmed: boolean;
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

export type PaymentMethodId = "cash-on-delivery" | "transfer" | "pay-on-pickup" | "online";

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  description: string;
  enabled: boolean;
  /** Métodos de entrega con los que se puede usar */
  deliveryMethods: DeliveryMethod[];
};

export type DeliveryZone = {
  id: string;
  name: string;
  description?: string;
  /** null = tarifa por confirmar (no se suma al total) */
  fee: number | null;
  /** Pedido mínimo específico de la zona (sobrescribe el global) */
  minOrder?: number;
  /** Tiempo estimado en minutos [mín, máx] */
  etaMinutes?: [number, number];
  available: boolean;
};

export type FaqItem = {
  id: string;
  question: string;
  /** null = respuesta pendiente de que el negocio la apruebe */
  answer: string | null;
};
