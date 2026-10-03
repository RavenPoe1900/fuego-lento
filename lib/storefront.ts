import { restaurant } from "@/config/restaurant";
import { isPreview } from "@/lib/dev";
import { isAcceptingAt, nextOpening } from "@/lib/schedule";
import { normalizePhone } from "@/lib/whatsapp";
import { getAllProducts } from "@/lib/catalog";
import type { StoreStatus, StorefrontConfig } from "@/types/restaurant";

export type PreviewPreset = StoreStatus;

/** Escenarios de la vista previa. Solo existen en isPreview. */
export const PREVIEW_PRESETS: Record<PreviewPreset, { label: string; config: Partial<StorefrontConfig>; forceOpen?: boolean }> = {
  open: {
    label: "Tienda abierta",
    config: { status: "open", statusMessage: "", orderingEnabled: true, whatsappOrderingEnabled: true, paymentMethodsConfirmed: true, hoursStatus: "confirmed", coverageEnabled: true },
    forceOpen: true,
  },
  temporarily_closed: { label: "Cerrado por reparaciones (real)", config: {} },
  coming_soon: {
    label: "Próxima reapertura",
    config: { status: "coming_soon", statusMessage: "Próxima reapertura", reopeningSignupEnabled: true },
  },
};

export type Storefront = {
  config: StorefrontConfig;
  status: StoreStatus;
  /** Texto corto para el indicador de estado */
  label: string;
  tone: "ok" | "err" | "gold";
  message: string;
  showMenu: boolean;
  showPrices: boolean;
  showHours: boolean;
  /** Tiempos, costos de envío y pedido mínimo */
  showDelivery: boolean;
  orderingEnabled: boolean;
  /** Canal de pedido: número válido y habilitado */
  whatsappNumber: string | null;
  whatsappReady: boolean;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  paymentsConfirmed: boolean;
  businessName: string;
  currencyCode: string;
  openNow: boolean;
  canOrderNow: boolean;
  canSchedule: boolean;
  canOrder: boolean;
  signupEnabled: boolean;
  next: string | null;
};

/** Resuelve qué puede mostrarse y permitirse. Función pura: la usan el hook y los componentes de servidor. */
export function resolveStorefront(override: PreviewPreset | null, now: Date | null): Storefront {
  const preset = isPreview && override ? PREVIEW_PRESETS[override] : null;
  const config: StorefrontConfig = { ...restaurant.storefront, ...(preset?.config ?? {}) };

  const showMenu = config.menuApproved || isPreview;
  const showPrices = config.pricesConfirmed || isPreview;
  const showHours = config.hoursStatus === "confirmed";
  const whatsappNumber = normalizePhone(restaurant.whatsapp);
  // En producción hace falta un número válido; en la vista previa se permite probar el flujo sin él (solo copiar resumen).
  const whatsappReady = config.whatsappOrderingEnabled && (whatsappNumber !== null || isPreview);
  const hasProducts = getAllProducts().some((p) => p.available);
  const orderingEnabled = config.status === "open" && config.orderingEnabled && whatsappReady && showMenu && showPrices && hasProducts;
  const openNow = config.status === "open" && (preset?.forceOpen || !showHours || !now || isAcceptingAt(now));
  const canOrderNow = orderingEnabled && openNow;
  const o = restaurant.ordering;
  const canSchedule = orderingEnabled && !openNow && showHours && o.scheduledEnabled && o.allowScheduledWhenClosed;

  const label =
    config.status === "open" ? (openNow ? "Abierto" : "Cerrado ahora") : config.status === "coming_soon" ? "Próxima reapertura" : "Cerrado temporalmente";

  return {
    config,
    status: config.status,
    label,
    tone: config.status === "open" && openNow ? "ok" : config.status === "coming_soon" ? "gold" : "err",
    message: config.statusMessage,
    showMenu,
    showPrices,
    showHours,
    showDelivery: orderingEnabled && config.coverageEnabled,
    orderingEnabled,
    whatsappNumber,
    whatsappReady,
    deliveryEnabled: o.deliveryEnabled,
    pickupEnabled: o.pickupEnabled,
    paymentsConfirmed: config.paymentMethodsConfirmed,
    businessName: restaurant.shortName,
    currencyCode: restaurant.currency.code,
    openNow,
    canOrderNow,
    canSchedule,
    canOrder: canOrderNow || canSchedule,
    signupEnabled: config.reopeningSignupEnabled && config.status !== "open",
    next: showHours && config.status === "open" && !openNow && now ? nextOpening(now) : null,
  };
}

/** Estado sin override ni reloj: lo que ve el público al cargar (componentes de servidor, SEO, FAQ). */
export const baseStorefront = resolveStorefront(null, null);
