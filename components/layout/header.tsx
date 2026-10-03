"use client";

import { Flame, Menu, ReceiptText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, IconButton } from "@/components/shared/button";
import { getMainNavigation } from "@/config/navigation";
import { restaurant } from "@/config/restaurant";
import { formatPrice } from "@/lib/currency";
import { useOrderSummary } from "@/lib/use-order-summary";
import { useStoreStatus } from "@/lib/use-store-status";
import { useCart } from "@/store/cart-store";
import { useUi } from "@/store/ui-store";
import { MobileNavigation } from "./mobile-navigation";

/**
 * Altura 76px → 64px al hacer scroll. La altura vive en la variable CSS
 * --header-height (html[data-scrolled]), así los sticky de debajo se recolocan solos.
 */
export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const openCart = useUi((s) => s.openCart);
  const setReopeningOpen = useUi((s) => s.setReopeningOpen);
  const hydrated = useCart((s) => s.hydrated);
  const lastAddedAt = useCart((s) => s.lastAddedAt);
  const { totals } = useOrderSummary();
  const sf = useStoreStatus();
  const count = hydrated ? totals.itemCount : 0;
  const nav = getMainNavigation(sf);

  useEffect(() => {
    const root = document.documentElement;
    const on = () => root.setAttribute("data-scrolled", String(window.scrollY > 16));
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 h-[var(--header-height)] bg-carbon/80 backdrop-blur-md transition-[height] duration-200">
        <div className="container-x flex h-full items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap font-display text-[1.65rem] font-semibold tracking-tight lg:text-[1.9rem]" aria-label={`${restaurant.shortName}, inicio`}>
            <Flame className="size-6 text-accent" aria-hidden />
            {restaurant.shortName}
          </Link>

          {nav.length > 0 && (
            <nav aria-label="Principal" className="hidden items-center gap-5 lg:flex xl:gap-8">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="link-underline py-2.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-cream/80 transition-colors hover:text-accent">
                  {n.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-1.5 sm:gap-3">
            {sf.orderingEnabled && (
              <button
                type="button"
                onClick={openCart}
                aria-label={`Abrir comanda, ${count} ${count === 1 ? "producto" : "productos"}${count ? `, ${formatPrice(totals.subtotal)}` : ""}`}
                className="relative inline-flex min-h-[46px] items-center gap-3 rounded-ui border border-line px-3 transition-colors hover:border-cream/30 hover:bg-white/[0.06] lg:px-4"
              >
                <span className="relative inline-flex">
                  <ReceiptText className="size-[24px]" strokeWidth={1.5} aria-hidden />
                  {count > 0 && (
                    <span key={lastAddedAt + "-" + count} aria-hidden className="anim-pop absolute -right-2 -top-2 flex min-w-[18px] items-center justify-center rounded-full bg-ember px-1 text-[0.6875rem] font-bold leading-[18px] tabular-nums text-cream">
                      {count}
                    </span>
                  )}
                </span>
                {count > 0 && <span className="hidden font-mono text-[0.75rem] font-medium tracking-[0.08em] tabular-nums lg:inline">{formatPrice(totals.subtotal)}</span>}
                <span className="sr-only" role="status" aria-live="polite">{count === 0 ? "Pedido vacío" : `${count} ${count === 1 ? "producto" : "productos"} en el pedido`}</span>
              </button>
            )}
            <div className="hidden lg:block">
              {sf.orderingEnabled ? (
                <Button size="sm" className="!shadow-none" onClick={openCart}>Ver comanda</Button>
              ) : sf.signupEnabled ? (
                <Button size="sm" className="!shadow-none" onClick={() => setReopeningOpen(true)}>Avísame</Button>
              ) : null}
            </div>
            <IconButton label="Abrir menú de navegación" className="lg:hidden" onClick={() => setNavOpen(true)}>
              <Menu className="size-6" aria-hidden />
            </IconButton>
          </div>
        </div>
      </header>
      <MobileNavigation open={navOpen} onClose={() => setNavOpen(false)} />
    </>
  );
}
