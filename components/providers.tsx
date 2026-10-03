"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { MobileCartBar } from "@/components/cart/mobile-cart-bar";
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
      <MobileCartBar />
      <DemoPanel />
      <Toaster
        position="top-center"
        duration={2600}
        offset={{ top: 80 }}
        toastOptions={{
          classNames: {
            toast: "!border !border-line !bg-surface !text-cream !shadow-[var(--shadow)] !rounded-ui !font-sans",
            description: "!text-cream2",
          },
        }}
      />
    </>
  );
}
