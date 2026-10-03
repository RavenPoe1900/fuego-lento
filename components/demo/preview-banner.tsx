import { isPreview } from "@/lib/dev";

/** Franja fija de la vista previa: deja claro que el contenido es de ejemplo y no confirmado. */
export function PreviewBanner() {
  if (!isPreview) return null;
  return (
    <div className="bg-gold px-4 py-1.5 text-center text-[0.8125rem] font-semibold text-carbon">
      Vista previa del diseño · productos, precios, horarios y zonas son datos de ejemplo no confirmados
    </div>
  );
}
