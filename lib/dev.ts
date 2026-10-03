/** Entorno de desarrollo local. */
export const isDev = process.env.NODE_ENV === "development";

/**
 * Vista previa del diseño (desarrollo o `npm run build:preview`).
 * Solo aquí se renderiza contenido de ejemplo, siempre bajo una franja que lo
 * identifica. La build pública nunca muestra datos no confirmados.
 */
export const isPreview = isDev || process.env.NEXT_PUBLIC_PREVIEW === "1";
