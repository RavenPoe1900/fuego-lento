"use client";

import { Flame, Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, IconButton, LinkButton } from "@/components/shared/button";
import { getMainNavigation } from "@/config/navigation";
import { restaurant } from "@/config/restaurant";
import { formatPrice } from "@/lib/currency";
import { useOrderSummary } from "@/lib/use-order-summary";
import { useStoreStatus } from "@/lib/use-store-status";
import { useCart } from "@/store/cart-store";
import { useUi } from "@/store/ui-store";
import { MobileNavigation } from "./mobile-navigation";
import { StatusPill } from "./status-pill";

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
            <Flame className="size-6 text-fire" aria-hidden />
            {restaurant.shortName}
          </Link>

          {nav.length > 0 && (
            <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="rounded-ui px-4 py-2.5 text-[0.9375rem] font-medium text-cream2 transition-colors hover:text-cream">
                  {n.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-1.5 sm:gap-3">
            <StatusPill />
            {sf.orderingEnabled && (
              <button
                type="button"
                onClick={openCart}
                aria-label={`Abrir pedido, ${count} ${count === 1 ? "producto" : "productos"}${count ? `, ${formatPrice(totals.subtotal)}` : ""}`}
                className="relative inline-flex min-h-11 items-center gap-2.5 rounded-full px-2.5 transition-colors hover:bg-white/10 lg:px-3"
              >
                <ShoppingBag className="size-[22px]" aria-hidden />
                {count > 0 && (
                  <span key={lastAddedAt + "-" + count} className="anim-pop absolute left-6 top-0.5 flex min-w-5 items-center justify-center rounded-full bg-ember px-1 text-[0.75rem] font-bold leading-5 tabular-nums lg:static">
                    {count}
                  </span>
                )}
                {count > 0 && <span className="hidden text-[0.9375rem] font-semibold tabular-nums lg:inline">{formatPrice(totals.subtotal)}</span>}
                <span className="sr-only" role="status" aria-live="polite">{count === 0 ? "Pedido vacío" : `${count} ${count === 1 ? "producto" : "productos"} en el pedido`}</span>
              </button>
            )}
            <div className="hidden lg:block">
              {sf.orderingEnabled ? (
                <LinkButton href="/menu/" size="sm" className="!shadow-none">Pedir</LinkButton>
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
