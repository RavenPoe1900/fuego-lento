import type { NextConfig } from "next";

/**
 * Maqueta estática: `npm run build` genera la carpeta `out/` lista para
 * subir a cualquier hosting estático.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: __dirname },
};

export default nextConfig;
