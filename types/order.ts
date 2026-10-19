import type { ProductCurrency } from "./product";
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
  /** Parte del subtotal que viene de productos fijados en USD, en USD (0 si no hay) */
  usdSubtotal: number;
  itemCount: number;
};

export type PricedLine = {
  lineId: string;
  productId: string;
  name: string;
  quantity: number;
  /** Importes en CUP (los productos en USD ya vienen convertidos): con ellos se calculan los totales */
  unitPrice: number;
  lineTotal: number;
  /** Moneda del producto y los mismos importes en esa moneda */
  currency: ProductCurrency;
  nativeUnitPrice: number;
  nativeLineTotal: number;
  /** Línea de venta, para agrupar la comanda */
  line: "carta" | "carnes";
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
