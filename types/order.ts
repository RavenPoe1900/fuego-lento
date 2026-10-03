import type { DeliveryMethod, PaymentMethodId } from "./restaurant";

/** groupId -> ids de opciones elegidas */
export type Selections = Record<string, string[]>;

export type CartLine = {
  /** Identificador estable de la línea */
  id: string;
  productId: string;
  quantity: number;
  selections: Selections;
  note: string;
};

export type Customer = {
  name: string;
  phone: string;
  /** Observaciones generales del pedido */
  notes: string;
};

export type Address = {
  zoneId: string;
  /** Dirección completa: calle, número, apartamento… */
  street: string;
  /** Referencia para localizar el lugar */
  reference: string;
  /** Instrucciones opcionales para el repartidor */
  instructions: string;
};

export type Schedule = { type: "asap" } | { type: "scheduled"; slot: string };

export type Totals = {
  subtotal: number;
  /** null = tarifa por confirmar: no se suma al total */
  deliveryFee: number | null;
  serviceFee: number;
  discount: number;
  /** Total estimado: subtotal + tarifa conocida + cargos − descuento */
  total: number;
  itemCount: number;
};

export type PricedLine = {
  lineId: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  /** Textos legibles de las opciones elegidas: "Término: Medio" */
  details: string[];
  note: string;
};

/** Resumen listo para mostrar y para convertir en mensaje de WhatsApp. */
export type OrderSummary = {
  deliveryMethod: DeliveryMethod;
  customer: Customer;
  address: Address | null;
  zoneName: string | null;
  scheduleLabel: string | null;
  paymentMethod: PaymentMethodId | null;
  paymentLabel: string | null;
  lines: PricedLine[];
  totals: Totals;
};
