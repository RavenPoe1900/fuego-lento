import { faqAvailable } from "@/data/faq";
import type { Storefront } from "@/lib/storefront";

export type NavItem = { label: string; href: string };

/**
 * Navegación principal: solo enlaces a secciones que se renderizan.
 * Cada etiqueta dice a dónde lleva; "Platos preparados" y "Carnes para cocinar" son las dos formas de comprar.
 * Entrega existe siempre (muestra el estado del servicio).
 */
export function getMainNavigation(sf: Storefront): NavItem[] {
  return [
    sf.showMenu && { label: "Platos preparados", href: "/menu/" },
    sf.showMenu && { label: "Carnes para cocinar", href: "/carnes/" },
    sf.orderingEnabled && { label: "Cómo pedir", href: "/#como-pedir" },
    { label: "Entrega", href: "/#entrega" },
  ].filter(Boolean) as NavItem[];
}

export function getFooterNavigation(sf: Storefront): NavItem[] {
  return [
    ...getMainNavigation(sf),
    faqAvailable(sf) && { label: "Preguntas frecuentes", href: "/preguntas-frecuentes/" },
  ].filter(Boolean) as NavItem[];
}

/** Páginas legales: texto real basado en cómo funciona la web; pendiente de revisión legal (se indica en cada página). */
export const legalNavigation: NavItem[] = [
  { label: "Aviso de privacidad", href: "/legal/privacidad/" },
  { label: "Términos del servicio", href: "/legal/terminos/" },
  { label: "Política de pedidos", href: "/legal/pedidos/" },
  { label: "Información sobre alérgenos", href: "/legal/alergenos/" },
];
