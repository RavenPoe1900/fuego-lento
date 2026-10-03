import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { Category, Product } from "@/types/product";

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

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured).slice(0, 4);
}

export function getCombos(): Product[] {
  return products.filter((p) => p.categoryId === "combos");
}
