"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { restaurant } from "@/config/restaurant";
import { safeLocalStorage } from "@/store/safe-storage";
import type { Address, Customer, Schedule } from "@/types/order";
import type { DeliveryMethod, PaymentMethodId } from "@/types/restaurant";

/**
 * Borrador del pedido: se conserva en este dispositivo (localStorage, con versión)
 * para no perder los datos al recargar. No se envía a ningún servidor.
 */
type CheckoutState = {
  /** Paso visible (no se persiste) */
  step: number;
  deliveryMethod: DeliveryMethod;
  customer: Customer;
  address: Address;
  schedule: Schedule;
  paymentMethod: PaymentMethodId | null;
  /** Momento en que se intentó abrir WhatsApp (no implica que el mensaje se enviara) */
  whatsappOpenedAt: string | null;
  set: (patch: Partial<Omit<CheckoutState, "set" | "resetDraft">>) => void;
  /** Borra los datos personales del borrador */
  resetDraft: () => void;
};

const initial = {
  step: 0,
  deliveryMethod: (restaurant.ordering.deliveryEnabled ? "delivery" : "pickup") as DeliveryMethod,
  customer: { name: "", phone: "", notes: "" },
  address: { zoneId: "", street: "", reference: "", instructions: "" },
  schedule: { type: "asap" } as Schedule,
  paymentMethod: null as PaymentMethodId | null,
  whatsappOpenedAt: null as string | null,
};

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
        schedule: s.schedule,
        paymentMethod: s.paymentMethod,
        whatsappOpenedAt: s.whatsappOpenedAt,
      }) as Partial<CheckoutState>,
      // Si el esquema cambió o los datos no son válidos, se parte de un borrador vacío
      migrate: () => ({ ...initial }) as unknown as CheckoutState,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<CheckoutState>;
        return {
          ...current,
          deliveryMethod: p.deliveryMethod === "pickup" || p.deliveryMethod === "delivery" ? p.deliveryMethod : current.deliveryMethod,
          customer: { ...current.customer, ...(p.customer ?? {}) },
          address: { ...current.address, ...(p.address ?? {}) },
          schedule: p.schedule ?? current.schedule,
          paymentMethod: p.paymentMethod ?? null,
          whatsappOpenedAt: p.whatsappOpenedAt ?? null,
        };
      },
    },
  ),
);
