import { normalizeSearch } from "@/lib/text";

/**
 * Alérgenos ORIENTATIVOS, deducidos de las palabras de la descripción de cada plato (ingredientes que
 * el menú menciona). No incluyen trazas, contaminación cruzada ni ingredientes que la carta no cite:
 * el restaurante debe confirmarlos por WhatsApp antes de pedir. Nunca se interpreta "ninguno" como seguro.
 */
const RULES: { label: string; pattern: RegExp }[] = [
  { label: "Gluten", pattern: /\b(pan|pasta|pastas|tagliatelle|raviolis?|empanada|croquetas?|tartaleta|baguette|tostadas?|hogaza|hamburguesa|gyozas?|ramen|harina|biscocho|bizcocho|malta|cebada|cerveza)\b/ },
  { label: "Lácteos", pattern: /\b(queso|quesos|mantequilla|crema|yogurt|bechamel|parmesano|provolone|cheddar|emmental|leche|helado|flan|flanquesillo|gratinadas?)\b/ },
  { label: "Huevo", pattern: /\b(huevo|yema|mayonesa|aioli|flan|flanquesillo|brulee|merengue|biscocho|bizcocho)\b/ },
  { label: "Crustáceos", pattern: /\b(gambon|gambones|langosta|camaron|camarones|cangrejo|langostinos?)\b/ },
  { label: "Mariscos", pattern: /\b(marisco|mariscos)\b/ },
  { label: "Moluscos", pattern: /\b(pulpo|calamar|calamares|mejillones|almejas|ostras?|vieiras?)\b/ },
  { label: "Pescado", pattern: /\b(pescado|pesca|ceviche|atun|salmon|anchoas?|bacalao|sardinas?)\b/ },
  { label: "Frutos secos", pattern: /\b(almendras?|nueces|nuez|avellanas?|pistachos?|cacahuates?|mani|pecanas?|anacardos?|pinones)\b/ },
  { label: "Soja", pattern: /\b(soja|soya|ponzu|teriyaki|miso)\b/ },
  { label: "Mostaza", pattern: /\b(mostaza|dijon)\b/ },
  { label: "Apio", pattern: /\bapio\b/ },
  { label: "Sésamo", pattern: /\b(sesamo|ajonjoli|tahini)\b/ },
  { label: "Sulfitos", pattern: /\b(vino|vinos|champagne|cava|oporto)\b/ },
];

const WINE_CATEGORIES = new Set(["vino-de-la-casa", "vinos-de-postre", "espumosos", "vinos-tintos", "vinos-blancos", "vinos-rosados"]);

/** Etiquetas de alérgenos que se deducen del texto (y de la categoría, en vinos). Puede devolver una lista vacía. */
export function deduceAllergens(text: string, categoryId?: string): string[] {
  const hay = normalizeSearch(text);
  const found = RULES.filter((r) => r.pattern.test(hay)).map((r) => r.label);
  if (categoryId && WINE_CATEGORIES.has(categoryId) && !found.includes("Sulfitos")) found.push("Sulfitos");
  return found;
}
