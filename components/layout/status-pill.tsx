"use client";

import { useStoreStatus } from "@/lib/use-store-status";

const DOT = { ok: "bg-ok", err: "bg-err", gold: "bg-gold" } as const;
const SHORT: Record<string, string> = { "Cerrado temporalmente": "Cerrado", "Próxima reapertura": "Pronto", Abierto: "Abierto", "Cerrado ahora": "Cerrado" };

export function StatusPill({ className = "" }: { className?: string }) {
  const { label, tone, ready } = useStoreStatus();
  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1.5 text-[0.8125rem] font-semibold ${className}`} role="status">
      <span className={`size-2 rounded-full ${ready ? DOT[tone] : "bg-cream2/40"}`} aria-hidden />
      <span className="max-sm:hidden">{ready ? label : "…"}</span>
      <span className="sm:hidden">{ready ? (SHORT[label] ?? label) : "…"}</span>
    </span>
  );
}
