"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { DemoPanel } from "@/components/demo/demo-panel";
import { ReopeningDialog } from "@/components/layout/reopening-dialog";
import { ProductDetailHost } from "@/components/menu/product-detail";
import { useCart } from "@/store/cart-store";
import { useCheckout } from "@/store/checkout-store";
import { useUi } from "@/store/ui-store";

/** Rehidrata el carrito tras el montaje (evita desajustes de hidratación) y monta los paneles globales. */
export function Providers() {
  useEffect(() => {
    void useCart.persist.rehydrate();
    void useUi.persist.rehydrate();
    void useCheckout.persist.rehydrate();
  }, []);
  return (
    <>
      <CartDrawer />
      <ProductDetailHost />
      <ReopeningDialog />
      <DemoPanel />
      <Toaster
        position="top-center"
        duration={2600}
        offset={{ top: 80 }}
        toastOptions={{
          classNames: {
            toast:
              "!gap-3.5 !rounded-ui !border !border-line !bg-surface2 !px-5 !py-4 !font-sans !text-cream !shadow-[var(--shadow-sm)]",
            title: "!text-[0.9375rem] !font-semibold !text-cream",
            description: "!mt-0.5 !text-[0.9375rem] !leading-snug !text-cream2",
            icon: "!text-cream2",
          },
        }}
      />
    </>
  );
}
