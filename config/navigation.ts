import { faqAvailable } from "@/data/faq";
import type { Storefront } from "@/lib/storefront";

export type NavItem = { label: string; href: string };

/**
 * Navegación principal: solo enlaces a secciones que se renderizan.
 * Manifiesto y Entrega existen siempre (Entrega muestra el estado del servicio);
 * Familias, Menú y Especialidades dependen de que el menú esté aprobado.
 */
export function getMainNavigation(sf: Storefront): NavItem[] {
  return [
    { label: "Oficio", href: "/#manifiesto" },
    sf.showMenu && { label: "Familias", href: "/#familias" },
    sf.showMenu && { label: "Menú", href: "/menu/" },
    sf.showMenu && { label: "Especialidades", href: "/#especialidades" },
    { label: "Entrega", href: "/#cobertura" },
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
