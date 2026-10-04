import { categories, categoryGroups } from "@/data/categories";
import { products } from "@/data/products";
import type { Category, CategoryGroup, CategoryGroupChild, Product } from "@/types/product";

const byId = new Map(products.map((p) => [p.id, p]));

export function getProduct(id: string): Product | undefined {
  return byId.get(id);
}

export function getAllProducts(): Product[] {
  return products;
}

/** Solo categorías con productos: no se muestran categorías vacías. */
export function getVisibleCategories(): Category[] {
  return categories.filter((c) => products.some((p) => p.categoryId === c.id));
}

/** Grupos con sus hijos visibles; un grupo sin categorías con productos no se muestra. */
export function getVisibleCategoryGroups(): CategoryGroup[] {
  const visible = new Set(getVisibleCategories().map((c) => c.id));
  return categoryGroups
    .map((g) => ({
      ...g,
      children: g.children
        .map((ch) => (ch.sections ? { ...ch, sections: ch.sections.filter((sec) => visible.has(sec.id)) } : ch))
        .filter((ch) => (ch.sections ? ch.sections.length > 0 : visible.has(ch.id))),
    }))
    .filter((g) => g.children.length > 0);
}

/** Categorías que cubre una subcategoría de grupo (una sola, o varias si tiene secciones). */
export function childCategoryIds(child: CategoryGroupChild): string[] {
  return child.sections ? child.sections.map((sec) => sec.id) : [child.id];
}

/** Categorías que cubre un grupo completo. */
export function groupCategoryIds(group: CategoryGroup): string[] {
  return group.children.flatMap(childCategoryIds);
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured).slice(0, 4);
}

export function getCombos(): Product[] {
  return products.filter((p) => p.categoryId === "combos");
}
