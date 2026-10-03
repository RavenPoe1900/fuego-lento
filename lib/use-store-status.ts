"use client";

import { useSyncExternalStore } from "react";
import { resolveStorefront, type Storefront } from "@/lib/storefront";
import { useUi } from "@/store/ui-store";

/** Reloj por minutos. En el servidor devuelve 0 (= aún no listo) para evitar desajustes de hidratación. */
const subscribe = (cb: () => void) => {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
};
const minuteNow = () => Math.floor(Date.now() / 60_000);

export type StoreStatusView = Storefront & { ready: boolean };

/** Estado comercial efectivo para componentes cliente (incluye el escenario de vista previa). */
export function useStoreStatus(): StoreStatusView {
  const override = useUi((s) => s.statusOverride);
  const minute = useSyncExternalStore(subscribe, minuteNow, () => 0);
  const now = minute ? new Date(minute * 60_000) : null;
  return { ...resolveStorefront(override, now), ready: now !== null };
}
