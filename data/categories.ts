import type { Category, CategoryGroup } from "@/types/product";

/** Categorías reales de la carta de Fuego Lento (carrta.app/fuegolento), en su orden original. */
export const categories: Category[] = [
  { id: "entrantes", slug: "entrantes-carta", name: "Entrantes", image: "/img/menu/provolone-ahumado-a-la-plancha.webp" },
  { id: "pastas", slug: "pastas", name: "Pastas", image: "/img/menu/tagliatelle-y-costillas-guisadas.webp" },
  { id: "principales", slug: "principales", name: "Principales", image: "/img/menu/langosta-torno-bacon.webp" },
  { id: "sartenes", slug: "sartenes", name: "Sartenes", image: "/img/menu/risotto-de-res-y-berenjena-escabechada.webp" },
  { id: "carnes-parrilla", slug: "carnes-parrilla", name: "Carnes Parrilla", image: "/img/menu/picana-angus-prime-230-grs.webp" },
  { id: "postre", slug: "postre", name: "Postre", image: "/img/menu/tarta-de-queso.webp" },
  { id: "bebidas", slug: "bebidas-carta", name: "Bebidas" },
  { id: "vino-de-la-casa", slug: "vino-de-la-casa", name: "Vino de la Casa", image: "/img/menu/bochorno-uva-viera.webp" },
  { id: "vinos-de-postre", slug: "vinos-de-postre", name: "Vinos de Postre", image: "/img/menu/mouton-cadet-sauternes-a-o-c-francia.webp" },
  { id: "espumosos", slug: "espumosos", name: "Espumosos", image: "/img/menu/moet-chandon-imperial-brut-champagne-a-o-c-francia.webp" },
  { id: "vinos-tintos", slug: "vinos-tintos", name: "Vinos Tintos", image: "/img/menu/imperial-reserva-tempranillo-2019-c-v-n-e.webp" },
  { id: "vinos-blancos", slug: "vinos-blancos", name: "Vinos Blancos", image: "/img/menu/leira-albarino-2024-pazo-pondal-d-o-rias-baixas-galicia.webp" },
  { id: "vinos-rosados", slug: "vinos-rosados", name: "Vinos Rosados", image: "/img/menu/roselin-prestige-2022-cotes-de-provence-a-o-p-francia.webp" },
  { id: "infusiones", slug: "infusiones", name: "Infusiones" },
  { id: "cocteles", slug: "cocteles", name: "Cocteles" },
  { id: "cocteles-tiki-de-autor", slug: "cocteles-tiki-de-autor", name: "Cocteles Tiki de Autor" },
  { id: "cocteles-clasicos-de-autor", slug: "cocteles-clasicos-de-autor", name: "Cocteles Clásicos de Autor" },
  { id: "ginebras", slug: "ginebras", name: "Ginebras" },
  { id: "vodkas", slug: "vodkas", name: "Vodkas" },
  { id: "brandy-cognac", slug: "brandy-cognac", name: "Brandy & Cognac" },
  { id: "cremas-y-licores", slug: "cremas-y-licores", name: "Cremas y Licores" },
  { id: "rones", slug: "rones", name: "Rones" },
  { id: "whiskys", slug: "whiskys", name: "Whiskys" },
  { id: "tequilas", slug: "tequilas", name: "Tequilas" },
];

/**
 * Grupos del menú. Cada grupo es un chip de la primera fila; sus hijos, la
 * segunda fila. Un hijo con `sections` reúne varias categorías de la carta
 * bajo un solo chip (p. ej. Vinos). Nombres y orden: idénticos a la carta.
 */
export const categoryGroups: CategoryGroup[] = [
  {
    id: "entrantes-grupo",
    slug: "entrantes",
    name: "Entrantes",
    allLabel: "Todos los entrantes",
    image: "/img/menu/provolone-ahumado-a-la-plancha.webp",
    children: [{ id: "entrantes", label: "Entrantes" }],
  },
  {
    id: "plato-principal",
    slug: "plato-principal",
    name: "Plato principal",
    allLabel: "Todos los platos",
    image: "/img/menu/picana-angus-prime-230-grs.webp",
    children: [
      { id: "pastas", label: "Pastas" },
      { id: "principales", label: "Principales" },
      { id: "sartenes", label: "Sartenes" },
      { id: "carnes-parrilla", label: "Carnes Parrilla" },
    ],
  },
  {
    id: "postres",
    slug: "postres",
    name: "Postres",
    allLabel: "Todos los postres",
    image: "/img/menu/tarta-de-queso.webp",
    children: [{ id: "postre", label: "Postre" }],
  },
  {
    id: "bebidas-grupo",
    slug: "bebidas",
    name: "Bebidas",
    allLabel: "Todas las bebidas",
    image: "/img/menu/imperial-reserva-tempranillo-2019-c-v-n-e.webp",
    children: [
      { id: "bebidas", label: "Bebidas" },
      {
        id: "vinos",
        label: "Vinos",
        sections: [
          { id: "vino-de-la-casa", label: "Vino de la Casa" },
          { id: "vinos-de-postre", label: "Vinos de Postre" },
          { id: "espumosos", label: "Espumosos" },
          { id: "vinos-tintos", label: "Vinos Tintos" },
          { id: "vinos-blancos", label: "Vinos Blancos" },
          { id: "vinos-rosados", label: "Vinos Rosados" },
        ],
      },
      { id: "infusiones", label: "Infusiones" },
      {
        id: "cocteles-todos",
        label: "Cocteles",
        sections: [
          { id: "cocteles", label: "Cocteles" },
          { id: "cocteles-tiki-de-autor", label: "Cocteles Tiki de Autor" },
          { id: "cocteles-clasicos-de-autor", label: "Cocteles Clásicos de Autor" },
        ],
      },
      {
        id: "destilados",
        label: "Destilados y licores",
        sections: [
          { id: "ginebras", label: "Ginebras" },
          { id: "vodkas", label: "Vodkas" },
          { id: "brandy-cognac", label: "Brandy & Cognac" },
          { id: "cremas-y-licores", label: "Cremas y Licores" },
          { id: "rones", label: "Rones" },
          { id: "whiskys", label: "Whiskys" },
          { id: "tequilas", label: "Tequilas" },
        ],
      },
    ],
  },
];
