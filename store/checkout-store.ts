"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { restaurant } from "@/config/restaurant";
import { safeLocalStorage } from "@/store/safe-storage";
import type { Address, Customer } from "@/types/order";
import type { DeliveryMethod } from "@/types/restaurant";

/**
 * Borrador del pedido: se conserva en este dispositivo (localStorage, con versión)
 * para no perder los datos al recargar. No se envía a ningún servidor.
 */
type CheckoutState = {
  deliveryMethod: DeliveryMethod;
  customer: Customer;
  address: Address;
  /** Momento en que se intentó abrir WhatsApp (no implica que el mensaje se enviara) */
  whatsappOpenedAt: string | null;
  set: (patch: Partial<Omit<CheckoutState, "set" | "resetDraft">>) => void;
  /** Borra los datos personales del borrador */
  resetDraft: () => void;
};

const initial = {
  deliveryMethod: (restaurant.ordering.deliveryEnabled ? "delivery" : "pickup") as DeliveryMethod,
  customer: { name: "", notes: "" },
  address: { street: "" },
  whatsappOpenedAt: null as string | null,
};

const text = (v: unknown) => (typeof v === "string" ? v : "");

export const useCheckout = create<CheckoutState>()(
  persist(
    (set) => ({
      ...initial,
      set: (patch) => set(patch),
      resetDraft: () => set({ ...initial }),
    }),
    {
      name: "fl-checkout",
      version: 1,
      storage: safeLocalStorage,
      skipHydration: true,
      partialize: (s) => ({
        deliveryMethod: s.deliveryMethod,
        customer: s.customer,
        address: s.address,
        whatsappOpenedAt: s.whatsappOpenedAt,
      }) as Partial<CheckoutState>,
      // Si el esquema cambió o los datos no son válidos, se parte de un borrador vacío
      migrate: () => ({ ...initial }) as unknown as CheckoutState,
      // Solo se recuperan los campos actuales: borradores antiguos (zona, teléfono, franja…) se ignoran
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<CheckoutState>;
        return {
          ...current,
          deliveryMethod: p.deliveryMethod === "pickup" || p.deliveryMethod === "delivery" ? p.deliveryMethod : current.deliveryMethod,
          customer: { name: text(p.customer?.name), notes: text(p.customer?.notes) },
          address: { street: text(p.address?.street) },
          whatsappOpenedAt: typeof p.whatsappOpenedAt === "string" ? p.whatsappOpenedAt : null,
        };
      },
    },
  ),
);
