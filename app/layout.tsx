import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { PreviewBanner } from "@/components/demo/preview-banner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";
import { restaurant } from "@/config/restaurant";
import { isPreview } from "@/lib/dev";
import { baseStorefront } from "@/lib/storefront";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const ui = Manrope({ variable: "--font-ui", subsets: ["latin"] });

const description = baseStorefront.orderingEnabled
  ? restaurant.seo.description
  : `${restaurant.name}: cortes y carnes.${baseStorefront.message ? ` ${baseStorefront.message}.` : ""}`;

export const metadata: Metadata = {
  metadataBase: new URL(restaurant.seo.siteUrl),
  title: { default: restaurant.name, template: `%s · ${restaurant.shortName}` },
  description,
  openGraph: {
    title: restaurant.name,
    description,
    siteName: restaurant.name,
    locale: "es_CU",
    type: "website",
    images: [restaurant.seo.ogImage],
  },
  // La vista previa (datos de ejemplo) nunca se indexa.
  robots: isPreview ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#0b0b0a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${ui.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-ui focus:bg-ember focus:px-4 focus:py-3">
          Saltar al contenido
        </a>
        <PreviewBanner />
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
        <Providers />
      </body>
    </html>
  );
}
