"use client";

import Link from "next/link";
import { Button, LinkButton } from "@/components/shared/button";
import { Dialog } from "@/components/shared/modal";
import { getFooterNavigation } from "@/config/navigation";
import { restaurant } from "@/config/restaurant";
import { useStoreStatus } from "@/lib/use-store-status";
import { useUi } from "@/store/ui-store";

export function MobileNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const sf = useStoreStatus();
  const setReopeningOpen = useUi((s) => s.setReopeningOpen);
  const items = getFooterNavigation(sf);
  return (
    <Dialog open={open} onClose={onClose} variant="drawer" title="Navegación">
      <nav aria-label="Móvil" className="flex flex-col p-5">
        {items.map((n) => (
          <Link key={n.href} href={n.href} onClick={onClose} className="border-b border-line py-4 font-display text-[1.875rem]">
            {n.label}
          </Link>
        ))}
        <div className="mt-6 space-y-3">
          {sf.orderingEnabled ? (
            <LinkButton href="/menu/" size="lg" className="w-full">Pedir</LinkButton>
          ) : sf.signupEnabled ? (
            <Button size="lg" className="w-full" onClick={() => { onClose(); setReopeningOpen(true); }}>Avísame cuando vuelvan</Button>
          ) : null}
          <LinkButton href={restaurant.instagram.url} external variant="secondary" size="lg" className="w-full">
            Instagram {restaurant.instagram.handle}
          </LinkButton>
        </div>
      </nav>
    </Dialog>
  );
}
