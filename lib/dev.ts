/** Entorno de desarrollo local. */
export const isDev = process.env.NODE_ENV === "development";

/**
 * Vista previa del diseño (datos de ejemplo, panel "Escenario", sin indexar): solo con
 * `NEXT_PUBLIC_PREVIEW=1`, es decir `npm run build:preview`. La build normal es la pública.
 */
export const isPreview = process.env.NEXT_PUBLIC_PREVIEW === "1";
