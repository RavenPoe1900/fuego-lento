import type { Category } from "@/types/product";

/** Categorías tentativas. Las que no tengan productos no se muestran. */
export const categories: Category[] = [
  { id: "cortes", slug: "cortes", name: "Cortes", image: "/img/demo/corte-casa.jpg" },
  { id: "hamburguesas", slug: "hamburguesas", name: "Hamburguesas", image: "/img/demo/burger.jpg" },
  { id: "especialidades", slug: "especialidades", name: "Especialidades", image: "/img/demo/costillas.jpg" },
  { id: "combos", slug: "combos", name: "Combos", image: "/img/demo/parrillada.jpg" },
  { id: "acompanamientos", slug: "acompanamientos", name: "Acompañamientos", image: "/img/demo/papas.jpg" },
  { id: "bebidas", slug: "bebidas", name: "Bebidas", image: "/img/demo/coctel.jpg" },
];

/** Categorías protagonistas de la portada (en este orden). */
export const homeCategoryIds = ["cortes", "hamburguesas", "especialidades", "combos", "bebidas"];
