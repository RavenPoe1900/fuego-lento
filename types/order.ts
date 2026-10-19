import type { ProductCurrency } from "./product";
import type { DeliveryMethod } from "./restaurant";

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
  /** Observaciones generales del pedido */
  notes: string;
};

export type Address = {
  /** Dirección completa: calle, número, apartamento… */
  street: string;
};

export type Totals = {
  /** Todo el pedido en CUP (los productos en USD, convertidos). Solo para cálculos internos: nunca se muestra como total único si hay dos monedas. */
  subtotal: number;
  /** Platos preparados, en CUP */
  cartaSubtotal: number;
  /** null = envío por confirmar: no se suma al total */
  deliveryFee: number | null;
  serviceFee: number;
  discount: number;
  /** Total estimado: subtotal + envío conocido + cargos − descuento */
  total: number;
  /** Carnes para cocinar, en USD (0 si no hay) */
  usdSubtotal: number;
  /** Alguna línea se cobra por peso real: el importe es una estimación */
  hasWeighted: boolean;
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
  /** Línea de venta, para agrupar el pedido: platos preparados o carnes para cocinar */
  line: "carta" | "carnes";
  /** Se cobra por peso real */
  weighted: boolean;
  /** Textos legibles de las opciones elegidas: "Término: Medio" */
  details: string[];
  note: string;
};

/** Resumen listo para mostrar y para convertir en mensaje de WhatsApp. */
export type OrderSummary = {
  deliveryMethod: DeliveryMethod;
  customer: Customer;
  address: Address | null;
  lines: PricedLine[];
  totals: Totals;
};
