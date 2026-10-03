"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeLocalStorage } from "@/store/safe-storage";
import type { PreviewPreset } from "@/lib/storefront";

type UiState = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  /** Producto abierto en el detalle; lineId cuando se edita una línea del carrito */
  product: { productId: string; lineId?: string } | null;
  openProduct: (productId: string, lineId?: string) => void;
  closeProduct: () => void;

  reopeningOpen: boolean;
  setReopeningOpen: (open: boolean) => void;

  /** Solo vista previa: escenario elegido en el panel de presentación. */
  statusOverride: PreviewPreset | null;
  setStatusOverride: (s: PreviewPreset | null) => void;
};

export const useUi = create<UiState>()(
  persist(
    (set) => ({
      cartOpen: false,
      openCart: () => set({ cartOpen: true, product: null }),
      closeCart: () => set({ cartOpen: false }),
      product: null,
      openProduct: (productId, lineId) => set({ product: { productId, lineId } }),
      closeProduct: () => set({ product: null }),
      reopeningOpen: false,
      setReopeningOpen: (reopeningOpen) => set({ reopeningOpen }),
      statusOverride: null,
      setStatusOverride: (statusOverride) => set({ statusOverride }),
    }),
    {
      name: "fl-preview",
      storage: safeLocalStorage,
      skipHydration: true,
      partialize: (s) => ({ statusOverride: s.statusOverride }) as Partial<UiState>,
    },
  ),
);
