import type { MetadataRoute } from "next";
import { restaurant } from "@/config/restaurant";
import { faqAvailable } from "@/data/faq";
import { baseStorefront } from "@/lib/storefront";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", baseStorefront.showMenu && "/menu/", faqAvailable(baseStorefront) && "/preguntas-frecuentes/"].filter(Boolean) as string[];
  return paths.map((p) => ({ url: `${restaurant.seo.siteUrl}${p}` }));
}
