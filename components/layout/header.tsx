"use client";

import { Menu, ReceiptText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, IconButton } from "@/components/shared/button";
import { getMainNavigation } from "@/config/navigation";
import { restaurant } from "@/config/restaurant";
import { formatCartAmount } from "@/lib/currency";
import { useOrderSummary } from "@/lib/use-order-summary";
import { useStoreStatus } from "@/lib/use-store-status";
import { useCart } from "@/store/cart-store";
import { useUi } from "@/store/ui-store";
import { MobileNavigation } from "./mobile-navigation";

/**
 * Altura 76px → 64px al hacer scroll. La altura vive en la variable CSS
 * --header-height (html[data-scrolled]), así los sticky de debajo se recolocan solos.
 * Es el único acceso persistente al pedido: no hay barra inferior ni botón flotante que lo repitan.
 */
export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();
  const openCart = useUi((s) => s.openCart);
  const setReopeningOpen = useUi((s) => s.setReopeningOpen);
  const hydrated = useCart((s) => s.hydrated);
  const lastAddedAt = useCart((s) => s.lastAddedAt);
  const { totals } = useOrderSummary();
  const sf = useStoreStatus();
  const count = hydrated ? totals.itemCount : 0;
  const amount = hydrated && count > 0 ? formatCartAmount(totals) : null;
  const nav = getMainNavigation(sf);
  const productos = `${count} ${count === 1 ? "producto" : "productos"}`;

  useEffect(() => {
    const root = document.documentElement;
    const on = () => root.setAttribute("data-scrolled", String(window.scrollY > 16));
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 h-[var(--header-height)] border-b border-line bg-carbon/90 backdrop-blur-md transition-[height] duration-200">
        <div className="container-x flex h-full items-center justify-between gap-4">
          <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap font-display text-[1.65rem] font-semibold tracking-tight lg:text-[1.9rem]" aria-label={`${restaurant.shortName}, inicio`}>
            <Image src="/img/logo-mark.webp" alt="" width={40} height={40} preload className="size-9 lg:size-10" />
            {restaurant.shortName}
          </Link>

          {nav.length > 0 && (
            <nav aria-label="Principal" className="hidden items-center gap-6 lg:flex xl:gap-9">
              {nav.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={`link-underline py-2.5 text-[0.8125rem] font-semibold transition-colors hover:text-cream ${active ? "text-cream after:!scale-x-100" : "text-cream2"}`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-1.5 sm:gap-3">
            {sf.orderingEnabled ? (
              <>
                <button
                  type="button"
                  onClick={openCart}
                  data-focus-return="cart"
                  aria-label={`Abrir mi pedido, ${productos}${amount ? `, ${amount}` : ""}`}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded-full border border-cream/40 px-3 text-cream transition-colors hover:border-cream/70 hover:bg-cream/[0.06] sm:px-4"
                >
                  <span className="relative inline-flex">
                    <ReceiptText className="size-[22px]" strokeWidth={1.5} aria-hidden />
                    {count > 0 && (
                      <span key={lastAddedAt + "-" + count} aria-hidden className="anim-pop absolute -right-2 -top-2 flex min-w-[18px] items-center justify-center rounded-full bg-ember px-1 text-[0.6875rem] font-bold leading-[18px] tabular-nums text-cream">
                        {count}
                      </span>
                    )}
                  </span>
                  <span className="hidden text-[0.8125rem] font-semibold sm:inline">Mi pedido</span>
                  {amount && <span className="hidden text-[0.8125rem] font-semibold tabular-nums text-cream2 xl:inline">{amount}</span>}
                </button>
                <span className="sr-only" role="status" aria-live="polite">{count === 0 ? "Tu pedido está vacío" : `${productos} en tu pedido`}</span>
              </>
            ) : sf.signupEnabled ? (
              <div className="hidden lg:block"><Button size="sm" onClick={() => setReopeningOpen(true)}>Avísame</Button></div>
            ) : null}
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
