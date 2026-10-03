"use client";

import { useMemo } from "react";
import { restaurant } from "@/config/restaurant";
import { deliveryZones } from "@/data/delivery-zones";
import { checkCoverage, type Coverage } from "@/lib/delivery";
import { computeTotals, priceCart } from "@/lib/order-calculations";
import { useCart } from "@/store/cart-store";
import { useCheckout } from "@/store/checkout-store";
import type { OrderSummary, Totals } from "@/types/order";

/** Único lugar donde se combinan carrito y datos de entrega para calcular importes. */
export function useOrderSummary() {
  const lines = useCart((s) => s.lines);
  const method = useCheckout((s) => s.deliveryMethod);
  const zoneId = useCheckout((s) => s.address.zoneId);
  const payment = useCheckout((s) => s.paymentMethod);
  const customer = useCheckout((s) => s.customer);
  const address = useCheckout((s) => s.address);
  const schedule = useCheckout((s) => s.schedule);

  return useMemo(() => {
    const { priced, issues } = priceCart(lines);
    const subtotal = priced.reduce((s, l) => s + l.lineTotal, 0);
    const coverage: Coverage | null = method === "delivery" ? checkCoverage(zoneId, subtotal) : null;
    // Recogida: sin costo. Entrega: solo si la zona está elegida y su tarifa está confirmada.
    const deliveryFee = method === "pickup" ? 0 : coverage?.status === "covered" ? coverage.fee : null;
    const totals: Totals = computeTotals(priced, deliveryFee);
    const zone = deliveryZones.find((z) => z.id === zoneId) ?? null;
    const minOrder = method === "delivery" && coverage?.status === "covered" ? coverage.minOrder : method === "delivery" ? (restaurant.ordering.minOrder ?? null) : null;
    const pay = restaurant.paymentMethods.find((p) => p.id === payment);
    const summary: OrderSummary = {
      deliveryMethod: method,
      customer,
      address: method === "delivery" ? address : null,
      zoneName: method === "delivery" ? (zone?.name ?? null) : null,
      scheduleLabel: null,
      paymentMethod: pay?.id ?? null,
      paymentLabel: pay?.label ?? null,
      lines: priced,
      totals,
    };
    return { lines, priced, issues, totals, coverage, minOrder, summary, schedule, method };
  }, [lines, method, zoneId, payment, customer, address, schedule]);
}
