"use client";

import { MessageCircle, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, LinkButton } from "@/components/shared/button";
import { Dialog } from "@/components/shared/modal";
import { EmptyState } from "@/components/shared/state-panels";
import { track } from "@/lib/analytics";
import { formatPrice } from "@/lib/currency";
import { useOrderSummary } from "@/lib/use-order-summary";
import { useStoreStatus } from "@/lib/use-store-status";
import { addressSchema, customerSchema, fieldErrors } from "@/lib/validation";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { useCheckout } from "@/store/checkout-store";
import { useUi } from "@/store/ui-store";
import { CartTicket, MethodToggle } from "./cart-ticket";
import { ComandaForm } from "./comanda-form";

const nameSchema = customerSchema.pick({ name: true });
const streetSchema = addressSchema.pick({ street: true });

export function CartDrawer() {
  const open = useUi((s) => s.cartOpen);
  const close = useUi((s) => s.closeCart);
  const { totals, lines, issues, method, minOrder, summary } = useOrderSummary();
  const { canOrder, orderingEnabled, message, businessName, whatsappNumber } = useStoreStatus();
  const setCheckout = useCheckout((s) => s.set);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    if (open) track("cart_opened");
  }, [open]);

  const belowMin = method === "delivery" && minOrder !== null && totals.subtotal < minOrder;
  const blocked = issues.length > 0 || !canOrder || belowMin;
  const count = totals.itemCount;

  const send = () => {
    setSendError(null);
    const next: Record<string, string> = {};
    const c = nameSchema.safeParse(summary.customer);
    if (!c.success) Object.assign(next, fieldErrors(c.error));
    if (method === "delivery") {
      const a = streetSchema.safeParse(summary.address);
      if (!a.success) Object.assign(next, fieldErrors(a.error));
    }
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    const url = buildWhatsAppUrl(whatsappNumber, buildWhatsAppMessage(summary, businessName));
    if (!url) return setSendError("Falta configurar el número de WhatsApp del restaurante.");
    track("whatsapp_order_clicked");
    setCheckout({ whatsappOpenedAt: new Date().toISOString() });
    // Acción iniciada directamente por el usuario: evita el bloqueo de ventanas emergentes.
    const w = window.open(url, "_blank");
    if (w) w.opener = null;
    else window.location.assign(url);
  };

  return (
    <Dialog
      open={open && orderingEnabled}
      onClose={close}
      variant="drawer"
      title={lines.length ? `Tu comanda · ${count} ${count === 1 ? "producto" : "productos"}` : "Tu comanda"}
      footer={
        lines.length > 0 && (
          <div className="space-y-4">
            {belowMin && (
              <p role="status" className="rounded-ui bg-gold/10 px-3 py-2 text-sm text-[#e3bd88]">
                Pedido mínimo para entrega: {formatPrice(minOrder)}. Te faltan {formatPrice(minOrder - totals.subtotal)}.
              </p>
            )}
            {!orderingEnabled && <p className="text-sm text-cream2">{message || "Ahora mismo no estamos recibiendo pedidos."}</p>}
            {sendError && <p role="alert" className="rounded-ui bg-err/10 p-3 text-sm text-err">{sendError}</p>}
            <Button size="lg" onClick={send} disabled={blocked} className="w-full">
              <MessageCircle className="size-5" aria-hidden /> Enviar comanda por WhatsApp
            </Button>
            <p className="text-[0.8125rem] leading-snug text-muted">El restaurante confirma disponibilidad, envío y pago por WhatsApp.</p>
          </div>
        )
      }
    >
      <div className="p-5">
        {lines.length === 0 ? (
          <EmptyState icon={<ShoppingBag className="size-9" aria-hidden />} title="Tu pedido todavía está vacío" text="Elige algo del menú y aparecerá aquí.">
            <LinkButton href="/menu/" onClick={close}>Explorar el menú</LinkButton>
          </EmptyState>
        ) : (
          <div className="space-y-6">
            <CartTicket onEdit={close} />
            <MethodToggle />
            <ComandaForm errors={errors} />
          </div>
        )}
      </div>
    </Dialog>
  );
}
