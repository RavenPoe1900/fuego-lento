import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ icon, title, text, children }: { icon?: ReactNode; title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line px-6 py-14 text-center">
      <div className="text-cream2">{icon ?? <Inbox className="size-8" aria-hidden />}</div>
      <h3 className="text-2xl">{title}</h3>
      {text && <p className="max-w-md text-cream2">{text}</p>}
      {children && <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}

export function ErrorState({ title = "Algo salió mal", text, children }: { title?: string; text?: string; children?: ReactNode }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-card border border-err/40 bg-err/10 px-6 py-12 text-center">
      <AlertTriangle className="size-8 text-err" aria-hidden />
      <h3 className="text-2xl">{title}</h3>
      {text && <p className="max-w-md text-cream2">{text}</p>}
      {children}
    </div>
  );
}

export function LoadingState({ label = "Cargando…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-cream2">
      <Loader2 className="size-5 animate-spin" aria-hidden />
      {label}
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-label="Cargando menú" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-card border border-line bg-surface">
          <div className="skeleton aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-4">
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-11 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
