"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct } from "@/lib/catalog";
import { lineKey, normalizeNote } from "@/lib/order-calculations";
import { safeLocalStorage } from "@/store/safe-storage";
import type { CartLine, Selections } from "@/types/order";

type LineInput = { productId: string; quantity: number; selections: Selections; note: string };

type CartState = {
  /** Solo ids, cantidades y opciones: nunca precios. Se recalculan desde el catálogo. */
  lines: CartLine[];
  hydrated: boolean;
  /** Último artículo añadido, para el feedback visual */
  lastAddedAt: number;
  updatedAt: string | null;
  add: (input: LineInput) => void;
  /** Reemplaza una línea editada; si queda idéntica a otra, se fusionan. */
  replace: (lineId: string, input: LineInput) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
};

export const CART_STORAGE_VERSION = 2;
const MAX_QTY = 20;
const newId = () => Math.random().toString(36).slice(2, 10);
const keyOf = (l: Pick<CartLine, "productId" | "selections" | "note">) => lineKey(l.productId, l.selections, l.note);
const stamp = () => new Date().toISOString();

/** Valida la estructura guardada y descarta líneas de productos que ya no existen. */
export function sanitizeLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const out: CartLine[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const l = item as Partial<CartLine>;
    if (typeof l.id !== "string" || typeof l.productId !== "string" || !getProduct(l.productId)) continue;
    const selections: Selections = {};
    if (l.selections && typeof l.selections === "object") {
      for (const [g, ids] of Object.entries(l.selections)) if (Array.isArray(ids)) selections[g] = ids.filter((x): x is string => typeof x === "string");
    }
    const quantity = Math.max(1, Math.min(MAX_QTY, Math.floor(Number(l.quantity) || 1)));
    out.push({ id: l.id, productId: l.productId, quantity, selections, note: normalizeNote(typeof l.note === "string" ? l.note : "") });
  }
  return out;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      hydrated: false,
      lastAddedAt: 0,
      updatedAt: null,
      add: (input) =>
        set((s) => {
          const note = normalizeNote(input.note);
          const key = keyOf({ ...input, note });
          const existing = s.lines.find((l) => keyOf(l) === key);
          const lines = existing
            ? s.lines.map((l) => (l === existing ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + input.quantity) } : l))
            : [...s.lines, { id: newId(), ...input, note }];
          return { lines, lastAddedAt: Date.now(), updatedAt: stamp() };
        }),
      replace: (lineId, input) =>
        set((s) => {
          const note = normalizeNote(input.note);
          const key = keyOf({ ...input, note });
          const twin = s.lines.find((l) => l.id !== lineId && keyOf(l) === key);
          if (twin) {
            return {
              lines: s.lines.filter((l) => l.id !== lineId).map((l) => (l === twin ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + input.quantity) } : l)),
              updatedAt: stamp(),
            };
          }
          return { lines: s.lines.map((l) => (l.id === lineId ? { ...l, ...input, note } : l)), updatedAt: stamp() };
        }),
      setQuantity: (lineId, quantity) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter((l) => l.id !== lineId)
              : s.lines.map((l) => (l.id === lineId ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l)),
          updatedAt: stamp(),
        })),
      remove: (lineId) => set((s) => ({ lines: s.lines.filter((l) => l.id !== lineId), updatedAt: stamp() })),
      clear: () => set({ lines: [], updatedAt: stamp() }),
    }),
    {
      name: "fl-cart",
      version: CART_STORAGE_VERSION,
      storage: safeLocalStorage,
      skipHydration: true,
      partialize: (s) => ({ lines: s.lines, updatedAt: s.updatedAt }) as Partial<CartState>,
      // Versiones anteriores o datos corruptos: se aprovechan solo las líneas válidas
      migrate: (persisted) => {
        const p = (persisted ?? {}) as { lines?: unknown; updatedAt?: string | null };
        return { lines: sanitizeLines(p.lines), updatedAt: p.updatedAt ?? null } as Partial<CartState>;
      },
      onRehydrateStorage: () => (state) => {
        // Valida lo restaurado (el catálogo pudo cambiar) antes de marcar el carrito como listo
        useCart.setState({ lines: sanitizeLines(state?.lines), hydrated: true });
      },
    },
  ),
);
