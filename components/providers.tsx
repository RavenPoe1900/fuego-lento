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
            toast:
              "!gap-3.5 !rounded-ui !border !border-accent/45 !bg-carbon !px-5 !py-4 !font-sans !text-accent !shadow-[0_20px_50px_-12px_rgba(0,0,0,0.75),inset_3px_0_0_var(--accent)]",
            title: "!font-mono !text-[0.75rem] !font-medium !uppercase !tracking-[0.16em] !text-[#e3bd88]",
            description: "!mt-0.5 !text-[0.9375rem] !leading-snug !text-accent",
            icon: "!text-accent",
          },
        }}
      />
    </>
  );
}
