/** Entorno de desarrollo local. */
export const isDev = process.env.NODE_ENV === "development";

/**
 * Vista previa del diseño: activa por defecto en todas las builds (también en Vercel),
 * con contenido de ejemplo bajo una franja que lo identifica y sin indexar.
 * Para la build pública que solo muestra datos confirmados: `NEXT_PUBLIC_PREVIEW=0 npm run build`.
 */
export const isPreview = process.env.NEXT_PUBLIC_PREVIEW !== "0";
