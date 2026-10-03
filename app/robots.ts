import type { MetadataRoute } from "next";
import { restaurant } from "@/config/restaurant";
import { isPreview } from "@/lib/dev";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isPreview ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/", disallow: ["/checkout/", "/pedido/"] },
    sitemap: `${restaurant.seo.siteUrl}/sitemap.xml`,
  };
}
