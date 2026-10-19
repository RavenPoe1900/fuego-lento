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
    config: { status: "open", statusMessage: "", orderingEnabled: true, whatsappOrderingEnabled: true, hoursStatus: "confirmed" },
    forceOpen: true,
  },
  temporarily_closed: { label: "Cerrado por reparaciones", config: { status: "temporarily_closed", orderingEnabled: false } },
  coming_soon: {
    label: "Próxima reapertura",
    config: { status: "coming_soon", orderingEnabled: false, statusMessage: "Próxima reapertura", reopeningSignupEnabled: true },
  },
};

export type Storefront = {
  config: StorefrontConfig;
  status: StoreStatus;
  /** Estado corto y único para hero, pie y avisos: "Abierto · Aceptamos pedidos", "Cerrado ahora"… */
  label: string;
  tone: "ok" | "err" | "gold";
  message: string;
  showMenu: boolean;
  showPrices: boolean;
  showHours: boolean;
  orderingEnabled: boolean;
  /** Canal de pedido: número válido y habilitado */
  whatsappNumber: string | null;
  whatsappReady: boolean;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  businessName: string;
  currencyCode: string;
  /** El local está dentro de su horario */
  openNow: boolean;
  /** Se puede enviar el pedido ahora mismo */
  canOrderNow: boolean;
  canOrder: boolean;
  /** Qué puede hacer el usuario cuando no se puede enviar ahora (null si puede enviar o no hay pedidos) */
  closedNote: string | null;
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
  const next = showHours && config.status === "open" && !openNow && now ? nextOpening(now) : null;

  const label =
    config.status === "open"
      ? openNow
        ? orderingEnabled
          ? "Abierto · Aceptamos pedidos"
          : "Abierto · Pedidos temporalmente pausados"
        : "Cerrado ahora"
      : config.status === "coming_soon"
        ? "Próxima reapertura"
        : "Cerrado temporalmente";

  const closedNote =
    orderingEnabled && !openNow
      ? `Ahora estamos cerrados${next ? `. Abrimos ${next.toLowerCase()}` : ""}. Puedes preparar tu pedido y enviarlo cuando abramos.`
      : null;

  return {
    config,
    status: config.status,
    label,
    tone: config.status === "open" && openNow && orderingEnabled ? "ok" : config.status === "coming_soon" ? "gold" : "err",
    message: config.statusMessage,
    showMenu,
    showPrices,
    showHours,
    orderingEnabled,
    whatsappNumber,
    whatsappReady,
    deliveryEnabled: restaurant.ordering.deliveryEnabled,
    pickupEnabled: restaurant.ordering.pickupEnabled,
    businessName: restaurant.shortName,
    currencyCode: restaurant.currency.code,
    openNow,
    canOrderNow,
    canOrder: canOrderNow,
    closedNote,
    signupEnabled: config.reopeningSignupEnabled && config.status !== "open",
    next,
  };
}

/** Estado sin override ni reloj: lo que ve el público al cargar (componentes de servidor, SEO, FAQ). */
export const baseStorefront = resolveStorefront(null, null);
