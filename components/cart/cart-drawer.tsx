"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { LinkButton } from "@/components/shared/button";
import { Dialog } from "@/components/shared/modal";
import { EmptyState } from "@/components/shared/state-panels";
import { track } from "@/lib/analytics";
import { formatPrice } from "@/lib/currency";
import { useOrderSummary } from "@/lib/use-order-summary";
import { useStoreStatus } from "@/lib/use-store-status";
import { useUi } from "@/store/ui-store";
import { CartTicket, MethodToggle } from "./cart-ticket";

export function CartDrawer() {
  const open = useUi((s) => s.cartOpen);
  const close = useUi((s) => s.closeCart);
  const { totals, lines, issues, method, minOrder } = useOrderSummary();
  const { canOrder, orderingEnabled, message } = useStoreStatus();

  useEffect(() => {
    if (open) track("cart_opened");
  }, [open]);

  const blocked = issues.length > 0 || !canOrder;
  const count = totals.itemCount;

  return (
    <Dialog
      open={open && orderingEnabled}
      onClose={close}
      variant="drawer"
      title={lines.length ? `Tu comanda · ${count} ${count === 1 ? "producto" : "productos"}` : "Tu comanda"}
      footer={
        lines.length > 0 && (
          <div className="space-y-4">
            <MethodToggle />
            {method === "delivery" && minOrder !== null && totals.subtotal < minOrder && (
              <p role="status" className="rounded-ui bg-gold/10 px-3 py-2 text-sm text-[#e3bd88]">
                Pedido mínimo para entrega: {formatPrice(minOrder)}. Te faltan {formatPrice(minOrder - totals.subtotal)}.
              </p>
            )}
            {!orderingEnabled && <p className="text-sm text-cream2">{message || "Ahora mismo no estamos recibiendo pedidos."}</p>}
            <p className="text-[0.8125rem] leading-snug text-muted">Se abre WhatsApp con tu comanda escrita.</p>
            <LinkButton href="/checkout/" onClick={close} size="lg" className={`w-full ${blocked ? "pointer-events-none opacity-45" : ""}`}>
              Enviar comanda por WhatsApp
            </LinkButton>
            <button type="button" onClick={close} className="block min-h-11 w-full text-center text-[0.9375rem] text-cream2 underline-offset-4 hover:text-cream hover:underline">
              Seguir viendo el menú
            </button>
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
          <CartTicket onEdit={close} />
        )}
      </div>
    </Dialog>
  );
}
