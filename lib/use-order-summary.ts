"use client";

import { useMemo } from "react";
import { computeTotals, priceCart } from "@/lib/order-calculations";
import { useCart } from "@/store/cart-store";
import { useCheckout } from "@/store/checkout-store";
import type { OrderSummary, Totals } from "@/types/order";

/** Único lugar donde se combinan carrito y datos de entrega para calcular importes. */
export function useOrderSummary() {
  const lines = useCart((s) => s.lines);
  const method = useCheckout((s) => s.deliveryMethod);
  const customer = useCheckout((s) => s.customer);
  const address = useCheckout((s) => s.address);

  return useMemo(() => {
    const { priced, issues } = priceCart(lines);
    // Recogida: sin costo. Entrega a domicilio: el coste se confirma por WhatsApp, así que no se suma.
    const deliveryFee = method === "pickup" ? 0 : null;
    const totals: Totals = computeTotals(priced, deliveryFee);
    const summary: OrderSummary = {
      deliveryMethod: method,
      customer,
      address: method === "delivery" ? address : null,
      lines: priced,
      totals,
    };
    return { lines, priced, issues, totals, summary, method };
  }, [lines, method, customer, address]);
}
