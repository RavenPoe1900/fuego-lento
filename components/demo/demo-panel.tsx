"use client";

import { Settings2, X } from "lucide-react";
import { useState } from "react";
import { isPreview } from "@/lib/dev";
import { PREVIEW_PRESETS, type PreviewPreset } from "@/lib/storefront";
import { useStoreStatus } from "@/lib/use-store-status";
import { useUi } from "@/store/ui-store";

/** Herramienta del presentador. Solo existe en la vista previa; la build pública no la incluye. */
export function DemoPanel() {
  const [open, setOpen] = useState(false);
  const { status } = useStoreStatus();
  const override = useUi((s) => s.statusOverride);
  const setOverride = useUi((s) => s.setStatusOverride);
  if (!isPreview) return null;
  const current: PreviewPreset = override ?? status;
  return (
    <div className="fixed bottom-24 left-3 z-[55] md:bottom-4">
      {open ? (
        <div className="w-72 rounded-card border border-gold/50 bg-warm p-4 shadow-[var(--shadow)]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-gold">Escenario de la vista previa</p>
            <button type="button" aria-label="Cerrar panel" onClick={() => setOpen(false)} className="inline-flex size-9 items-center justify-center rounded-full hover:bg-white/10">
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <fieldset>
            <legend className="sr-only">Escenario</legend>
            <div className="space-y-1">
              {(Object.keys(PREVIEW_PRESETS) as PreviewPreset[]).map((k) => (
                <label key={k} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-ui px-2 text-sm hover:bg-white/5">
                  <input type="radio" name="preview-status" checked={current === k} onChange={() => setOverride(k)} className="accent-[var(--ember)]" />
                  {PREVIEW_PRESETS[k].label}
                </label>
              ))}
            </div>
          </fieldset>
          <p className="mt-2 text-xs text-cream2">“Tienda abierta” es solo para enseñar el flujo de compra: no refleja el estado real.</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Escenario de la vista previa"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/50 bg-warm px-3.5 text-sm text-gold shadow-[var(--shadow)] max-sm:size-11 max-sm:justify-center max-sm:p-0"
        >
          <Settings2 className="size-4" aria-hidden /> <span className="max-sm:sr-only">Escenario</span>
        </button>
      )}
    </div>
  );
}
