"use client";

import { Copy, MessageCircle, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, LinkButton } from "@/components/shared/button";
import { Dialog } from "@/components/shared/modal";
import { EmptyState } from "@/components/shared/state-panels";
import { track } from "@/lib/analytics";
import { useOrderSummary } from "@/lib/use-order-summary";
import { useStoreStatus } from "@/lib/use-store-status";
import { addressSchema, customerSchema, fieldErrors } from "@/lib/validation";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { useCart } from "@/store/cart-store";
import { useCheckout } from "@/store/checkout-store";
import { useUi } from "@/store/ui-store";
import { CartTicket, MethodToggle } from "./cart-ticket";
import { ComandaForm } from "./comanda-form";

const nameSchema = customerSchema.pick({ name: true });

/**
 * Mi pedido: panel lateral para revisar, editar y enviar. Distingue tres momentos:
 * preparar (aquí), enviar (abre WhatsApp con el resumen) y confirmar (lo hace el restaurante por WhatsApp).
 * Abrir WhatsApp nunca vacía el pedido ni lo da por confirmado.
 */
export function CartDrawer() {
  const open = useUi((s) => s.cartOpen);
  const close = useUi((s) => s.closeCart);
  const { totals, lines, issues, method, summary } = useOrderSummary();
  const { canOrder, orderingEnabled, closedNote, businessName, whatsappNumber } = useStoreStatus();
  const setCheckout = useCheckout((s) => s.set);
  const resetDraft = useCheckout((s) => s.resetDraft);
  const openedAt = useCheckout((s) => s.whatsappOpenedAt);
  const clearCart = useCart((s) => s.clear);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sendError, setSendError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (open) track("cart_opened");
  }, [open]);

  const closePanel = () => {
    setConfirmClear(false);
    close();
  };

  const blocked = issues.length > 0 || !canOrder;
  const count = totals.itemCount;
  const message = () => buildWhatsAppMessage(summary, businessName);

  const send = () => {
    setSendError(null);
    const next: Record<string, string> = {};
    const c = nameSchema.safeParse(summary.customer);
    if (!c.success) Object.assign(next, fieldErrors(c.error));
    if (method === "delivery") {
      const a = addressSchema.safeParse(summary.address ?? { street: "" });
      if (!a.success) Object.assign(next, fieldErrors(a.error));
    }
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    const url = buildWhatsAppUrl(whatsappNumber, message());
    if (!url) return setSendError("No pudimos preparar el enlace de WhatsApp. Copia el resumen y envíalo al número del restaurante.");
    track("whatsapp_order_clicked");
    setCheckout({ whatsappOpenedAt: new Date().toISOString() });
    // Acción iniciada directamente por el usuario: evita el bloqueo de ventanas emergentes.
    const w = window.open(url, "_blank");
    if (w) w.opener = null;
    else window.location.assign(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message());
      track("order_summary_copied");
      toast.success("Resumen copiado", { description: "Pégalo en WhatsApp para enviarlo." });
    } catch {
      toast.error("No pudimos copiar el resumen", { description: "Prueba a enviarlo con el botón de WhatsApp." });
    }
  };

  const clearAll = () => {
    clearCart();
    resetDraft();
    setConfirmClear(false);
    setErrors({});
    setSendError(null);
    toast("Pedido vaciado");
  };

  return (
    <Dialog
      open={open && orderingEnabled}
      onClose={closePanel}
      variant="drawer"
      title={lines.length ? `Mi pedido · ${count} ${count === 1 ? "producto" : "productos"}` : "Mi pedido"}
      footer={
        lines.length > 0 && (
          <div className="space-y-3">
            {issues.length > 0 && <p role="status" className="rounded-ui bg-err/10 px-3 py-2 text-sm text-err-soft">Revisa los productos marcados antes de enviar el pedido.</p>}
            {closedNote && <p role="status" className="rounded-ui bg-gold/10 px-3 py-2 text-sm text-gold-soft">{closedNote}</p>}
            {sendError && <p role="alert" className="rounded-ui bg-err/10 p-3 text-sm text-err-soft">{sendError}</p>}
            <Button size="lg" onClick={send} disabled={blocked} className="w-full">
              <MessageCircle className="size-5" aria-hidden /> {openedAt ? "Volver a abrir WhatsApp" : "Enviar pedido por WhatsApp"}
            </Button>
            <p className="text-[0.8125rem] leading-snug text-cream2">
              {openedAt
                ? "Abrimos WhatsApp con tu pedido, pero todavía no está confirmado: el restaurante te responderá por ahí. Conservamos tu pedido por si necesitas volver."
                : "Se abrirá WhatsApp con el resumen. La disponibilidad y las condiciones se confirman por WhatsApp."}
            </p>
            {(openedAt || sendError) && (
              <div className="flex flex-wrap items-center gap-x-4">
                <Button variant="ghost" size="sm" onClick={copy}><Copy className="size-4" aria-hidden /> Copiar resumen</Button>
                {confirmClear ? (
                  <span className="flex items-center gap-2 text-sm">
                    ¿Vaciar el pedido?
                    <Button variant="ghost" size="sm" onClick={clearAll}>Sí, vaciar</Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>Cancelar</Button>
                  </span>
                ) : (
                  <Button variant="link" size="sm" onClick={() => setConfirmClear(true)}>Vaciar pedido</Button>
                )}
              </div>
            )}
          </div>
        )
      }
    >
      <div className="p-5">
        {lines.length === 0 ? (
          <EmptyState icon={<ShoppingBag className="size-9" aria-hidden />} title="Tu pedido está vacío" text="Elige platos preparados o carnes para cocinar y aparecerán aquí.">
            <LinkButton href="/menu/" onClick={close}>Ver platos preparados</LinkButton>
            <LinkButton href="/carnes/" variant="secondary" onClick={close}>Ver carnes para cocinar</LinkButton>
          </EmptyState>
        ) : (
          <div className="space-y-6">
            <CartTicket onEdit={closePanel} />
            <MethodToggle />
            <ComandaForm errors={errors} />
          </div>
        )}
      </div>
    </Dialog>
  );
}
