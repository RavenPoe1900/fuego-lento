"use client";

import { ReceiptText } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { Button } from "@/components/shared/button";
import { formatPrice } from "@/lib/currency";
import { EASE_EDITORIAL } from "@/lib/motion";
import { useOrderSummary } from "@/lib/use-order-summary";
import { useStoreStatus } from "@/lib/use-store-status";
import { useCart } from "@/store/cart-store";
import { useUi } from "@/store/ui-store";

/** Barra fija inferior (solo móvil). Aparece cuando hay productos y se destaca al añadir uno. */
export function MobileCartBar() {
  const pathname = usePathname();
  const open = useUi((s) => s.openCart);
  const hidden = useUi((s) => s.cartOpen || s.product !== null);
  const lastAddedAt = useCart((s) => s.lastAddedAt);
  const reduce = useReducedMotion();
  const { totals } = useOrderSummary();
  const { orderingEnabled } = useStoreStatus();
  const show = !(totals.itemCount === 0 || hidden || pathname.startsWith("/checkout") || pathname.startsWith("/pedido") || !orderingEnabled);

  useEffect(() => {
    document.body.toggleAttribute("data-cart-bar", show);
    return () => document.body.removeAttribute("data-cart-bar");
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { y: "100%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "100%" }}
          transition={{ duration: 0.28, ease: EASE_EDITORIAL }}
          className="fixed inset-x-0 bottom-0 z-[45] border-t border-line bg-warm/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden"
        >
          <motion.div
            // Un pequeño pulso (escala mínima) confirma que el pedido cambió
            key={lastAddedAt}
            initial={reduce || !lastAddedAt ? false : { scale: 0.97 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.25, ease: EASE_EDITORIAL }}
          >
            <Button size="lg" className="w-full !justify-between whitespace-nowrap" onClick={open} aria-label={`Ver comanda: ${totals.itemCount} productos, ${formatPrice(totals.subtotal)}`}>
              <span className="flex items-center gap-2.5">
                <ReceiptText className="size-[18px]" aria-hidden />
                <span>Ver comanda · <AnimatedCounter value={totals.itemCount} /></span>
              </span>
              <span className="tabular-nums">{formatPrice(totals.subtotal)}</span>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
