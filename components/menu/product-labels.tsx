import { Badge } from "@/components/shared/badge";
import type { Product, ProductTag } from "@/types/product";

const TAGS: Record<ProductTag, { label: string; tone: "ember" | "gold" | "neutral" | "ok" }> = {
  nuevo: { label: "Nuevo", tone: "gold" },
  "mas-pedido": { label: "Más pedido", tone: "ember" },
  picante: { label: "🌶 Picante", tone: "ember" },
  "para-compartir": { label: "Para compartir", tone: "neutral" },
  "edicion-limitada": { label: "Edición limitada", tone: "gold" },
  vegetariano: { label: "Vegetariano", tone: "ok" },
};

export function ProductTags({ product }: { product: Product }) {
  if (!product.tags.length) return null;
  return (
    <>
      {product.tags.map((t) => (
        <Badge key={t} tone={TAGS[t].tone}>
          {TAGS[t].label}
        </Badge>
      ))}
    </>
  );
}

export function isCustomizable(product: Product) {
  return product.optionGroups.length > 0;
}
