import { faqAvailable } from "@/data/faq";
import type { Storefront } from "@/lib/storefront";

export type NavItem = { label: string; href: string };

/** Navegación principal: solo enlaces a contenido que existe y está confirmado. */
export function getMainNavigation(sf: Storefront): NavItem[] {
  return [
    sf.showMenu && { label: "Menú", href: "/menu/" },
    sf.showDelivery && { label: "Cobertura", href: "/#cobertura" },
  ].filter(Boolean) as NavItem[];
}

export function getFooterNavigation(sf: Storefront): NavItem[] {
  return [
    ...getMainNavigation(sf),
    faqAvailable(sf) && { label: "Preguntas frecuentes", href: "/preguntas-frecuentes/" },
  ].filter(Boolean) as NavItem[];
}

/** Páginas legales: placeholders hasta que el negocio las apruebe; solo se enlazan en la vista previa. */
export const legalNavigation: NavItem[] = [
  { label: "Aviso de privacidad", href: "/legal/privacidad/" },
  { label: "Términos del servicio", href: "/legal/terminos/" },
  { label: "Política de pedidos", href: "/legal/pedidos/" },
  { label: "Información sobre alérgenos", href: "/legal/alergenos/" },
];
