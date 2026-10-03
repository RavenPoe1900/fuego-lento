"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { useStoreStatus } from "@/lib/use-store-status";
import { toast } from "sonner";
import { useCart } from "@/store/cart-store";
import { useUi } from "@/store/ui-store";
import type { Product } from "@/types/product";

/** Lógica compartida por las tarjetas de producto y de combo. */
export function useProductAction(product: Product) {
  const openProduct = useUi((s) => s.openProduct);
  const add = useCart((s) => s.add);
  const { orderingEnabled, showPrices } = useStoreStatus();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const soldOut = !product.available;
  /** Solo se puede comprar cuando el servicio está habilitado */
  const canBuy = orderingEnabled;
  const showPrice = showPrices;
  const custom = product.optionGroups.length > 0;
  /** "Desde" solo si una opción obligatoria cambia el precio */
  const priceVaries = product.optionGroups.some((g) => g.required && new Set(g.options.map((o) => o.priceDelta)).size > 1);

  const open = () => {
    track("product_viewed", { id: product.id });
    openProduct(product.id);
  };
  const quickAdd = () => {
    add({ productId: product.id, quantity: 1, selections: {}, note: "" });
    track("product_added", { id: product.id });
    toast.success("Producto añadido", { description: product.name });
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1400);
  };

  return { soldOut, canBuy, showPrice, custom, priceVaries, added, open, quickAdd };
}
