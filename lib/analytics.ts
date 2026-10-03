/**
 * Capa de eventos independiente del proveedor. Conecta aquí GA4, Plausible,
 * Meta Pixel, etc. Abrir WhatsApp NO es una compra completada.
 */
export type CommerceEvent =
  | "product_viewed"
  | "product_added"
  | "product_updated"
  | "product_removed"
  | "cart_opened"
  | "checkout_started"
  | "fulfillment_selected"
  | "whatsapp_order_clicked"
  | "order_summary_copied"
  | "view_menu"
  | "view_category"
  | "coverage_error"
  | "reopening_signup";

type Listener = (event: CommerceEvent, payload?: Record<string, unknown>) => void;
const listeners: Listener[] = [];

export function onCommerceEvent(listener: Listener) {
  listeners.push(listener);
}

export function track(event: CommerceEvent, payload?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "development") console.debug("[analytics]", event, payload ?? "");
  for (const l of listeners) l(event, payload);
}
