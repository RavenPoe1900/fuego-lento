export type ProductTag =
  | "nuevo"
  | "mas-pedido"
  | "picante"
  | "para-compartir"
  | "edicion-limitada"
  | "vegetariano";

/**
 * Tipo de grupo de opciones. Determina el texto de ayuda y cómo se presenta
 * cada opción (incluida, sustitución, extra, etc.).
 */
export type OptionGroupKind =
  | "cooking" // término de cocción
  | "side" // acompañamiento incluido
  | "substitution" // sustituir un elemento incluido
  | "sauce" // salsa
  | "extra" // extras con costo
  | "remove"; // quitar ingredientes permitidos

export type ProductOption = {
  id: string;
  name: string;
  /** Incremento sobre el precio base. 0 = sin costo */
  priceDelta: number;
  available: boolean;
  /** Indica que la opción viene incluida (p. ej. salsa incluida) */
  included?: boolean;
  description?: string;
};

export type OptionGroup = {
  id: string;
  name: string;
  kind: OptionGroupKind;
  required: boolean;
  minSelections: number;
  maxSelections: number;
  options: ProductOption[];
  /** Ayuda editable (p. ej. guía de términos de cocción) */
  helpText?: string;
};

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  images: ProductImage[];
  basePrice: number;
  /** Solo si existe una promoción real */
  compareAtPrice?: number;
  featured: boolean;
  available: boolean;
  tags: ProductTag[];
  ingredients: string[];
  allergens: string[];
  /** Peso o tamaño, solo si está confirmado */
  size?: string;
  /** Combos: número de personas */
  serves?: number;
  /** Combos: qué incluye */
  includes?: string[];
  optionGroups: OptionGroup[];
  isDemo?: boolean;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
};
