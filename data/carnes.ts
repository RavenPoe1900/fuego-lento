import type { OptionGroup, Product, ProductOption } from "@/types/product";

/**
 * CARNES A DOMICILIO: lista de precios y combos de "Fuego Lento · Carnes premium a domicilio"
 * (Fuego_Lento_Menu_Domicilio.pdf). Precios en USD; el equivalente en CUP sale de `restaurant.fx`.
 * Viven aparte de la carta de Carrta (data/products.ts) pero comparten catálogo, carrito y comanda.
 * Las fotos son provisionales (cortes ya cocinados de la carta) hasta tener las de cada pieza.
 */

export type MeatCategory = {
  id: "steaks" | "cortes" | "embutidos" | "combos";
  name: string;
  /** Una línea para la tarjeta de portada */
  description: string;
  /** Cómo se vende: lo que significa el precio */
  saleFormat: string;
  /** Texto del botón de la tarjeta */
  cta: string;
};

export const meatCategories: MeatCategory[] = [
  { id: "steaks", name: "Steaks en porción", description: "Porciones individuales de 8 a 12 oz.", saleFormat: "Precio por pieza", cta: "Ver steaks" },
  { id: "cortes", name: "Cortes de la casa", description: "Ribeye, lip-on, vacío y lomo de tira, porcionados en Fuego Lento.", saleFormat: "Porciones de peso fijo y piezas por kg", cta: "Ver cortes" },
  { id: "embutidos", name: "Embutidos para la parrilla", description: "Morcilla, longaniza y cuerda de chorizo.", saleFormat: "Precio por paquete", cta: "Ver embutidos" },
  { id: "combos", name: "Combos", description: "Parrilladas para 2 y para 4 personas, con su contenido detallado.", saleFormat: "Precio por combo", cta: "Ver combos" },
];

/**
 * Las fotos de las carnes son provisionales (cortes ya cocinados) y pueden confundir con la pieza cruda:
 * se muestran solo cuando exista la fotografía real de cada pieza. Poner a true entonces.
 */
const SHOW_PHOTOS = false;

const USD_ROUND = (n: number) => Math.round(n * 100) / 100;

const opt = (id: string, name: string, priceDelta = 0, extra: Partial<ProductOption> = {}): ProductOption => ({ id, name, priceDelta, available: true, ...extra });

/** Pieza que se cobra por kg: `basePrice` es el precio de 1 kg; el cliente elige el peso aproximado y se ajusta al pesarla. */
const peso = (perKg: number, options: { kg: number; label?: string }[]): OptionGroup => ({
  id: "peso",
  name: "Peso aproximado",
  kind: "weight",
  required: true,
  minSelections: 1,
  maxSelections: 1,
  helpText: "Se cobra según el peso real de la pieza; el importe del pedido es una estimación.",
  options: options.map(({ kg, label }) => opt(`${kg}-kg`, label ?? `${kg} kg`, USD_ROUND(perKg * (kg - 1)))),
});

type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  size?: string;
  image?: string;
  availableFrom?: string;
  priceNote?: string;
  optionGroups?: OptionGroup[];
};

const toProduct = (categoryId: string) => (item: Item): Product => ({
  id: item.id,
  slug: item.id,
  name: item.name,
  shortDescription: item.description,
  description: item.description,
  categoryId,
  images: SHOW_PHOTOS && item.image ? [{ src: `/img/menu/${item.image}.webp`, alt: item.name }] : [],
  basePrice: item.price,
  currency: "USD",
  line: "carnes",
  featured: false,
  available: true,
  tags: [],
  ingredients: [],
  allergens: [],
  // Las conversiones de unidad son redondeadas: se marcan como aproximadas ("12 oz (≈ 340 g)")
  ...(item.size && { size: item.size.replace(/\((\d[\d.,]*\s*(?:g|kg))\)/, "(≈ $1)") }),
  ...(item.priceNote && { priceNote: item.priceNote, byWeight: true }),
  ...(item.availableFrom && { availableFrom: item.availableFrom }),
  optionGroups: item.optionGroups ?? [],
});

const MEAT: Record<string, Item[]> = {
  steaks: [
    { id: "ribeye-boneless-choice", name: "Ribeye boneless CHOICE", description: "Ribeye deshuesado CHOICE, porción individual.", price: 14.93, size: "12 oz (340 g)", image: "new-york-steak-angus-prime-350-grs" },
    { id: "chuleton-deshuesado-choice", name: "Chuletón deshuesado CHOICE", description: "Chuletón deshuesado CHOICE, porción individual.", price: 12.37, size: "10 oz (283 g)", image: "new-york-steak-angus-prime-350-grs" },
    { id: "filete-ribeye-roll", name: "Filete Ribeye Roll", description: "Filete de ribeye roll, porción individual.", price: 9.0, size: "10 oz (283 g)", image: "filetillo-de-res" },
    { id: "filete-de-lomo", name: "Filete de lomo", description: "Filete de lomo, porción individual.", price: 5.96, size: "8 oz (227 g)", image: "filetillo-angus-con-esencia-de-ajo-y-miel-250-grs" },
    { id: "t-bone-choice", name: "T-bone CHOICE", description: "T-bone CHOICE, porción individual.", price: 18.64, size: "12 oz (340 g)", image: "t-bone-angus-prime-400-grs", availableFrom: "21/10" },
    { id: "solomillo-top-2-3", name: "Solomillo top 2/3", description: "Solomillo top 2/3, porción individual.", price: 10.13, size: "8 oz (227 g)", image: "filetillo-de-res", availableFrom: "21/10" },
  ],
  cortes: [
    {
      id: "ribeye-export",
      name: "Ribeye EXPORT",
      description: "Ribeye EXPORT porcionado en Fuego Lento, de 1 a 2 kg.",
      price: 48.55,
      size: "porción de 1 a 2 kg",
      priceNote: "por kg · se cobra según el peso real",
      image: "picana-angus-prime-600-grs",
      optionGroups: [peso(48.55, [{ kg: 1 }, { kg: 1.5 }, { kg: 2 }])],
    },
    { id: "ribeye-lip-on-choice", name: "Ribeye lip-on CHOICE", description: "Ribeye lip-on CHOICE, porción de 300 g.", price: 15.39, size: "porción 300 g", image: "picana-angus-prime-300-grs" },
    { id: "chuleton-lip-on-choice", name: "Chuletón lip-on CHOICE", description: "Chuletón lip-on CHOICE, porción de 300 g.", price: 14.33, size: "porción 300 g", image: "picana-angus-prime-300-grs" },
    { id: "churrasco-de-vacio-angus", name: "Churrasco de vacío Angus", description: "Churrasco de vacío Angus, porción de 300 g.", price: 12.47, size: "porción 300 g", image: "churrasco-angus-prime-460-grs" },
    { id: "lomo-de-tira-certified-angus", name: "Lomo de tira Certified Angus", description: "Lomo de tira Certified Angus, porción de 300 g.", price: 12.18, size: "porción 300 g", image: "brocheta-de-res" },
    {
      id: "tapa-de-solomillo-certified-angus",
      name: "Tapa de solomillo Certified Angus",
      description: "Tapa de solomillo Certified Angus, pieza completa de unos 1.2 kg.",
      price: 27.67,
      size: "pieza completa",
      priceNote: "por kg · se cobra según el peso real",
      image: "picana-angus-prime-460-grs",
      optionGroups: [peso(27.67, [{ kg: 1.2, label: "Pieza completa (~1.2 kg)" }])],
    },
  ],
  embutidos: [
    { id: "morcilla", name: "Morcilla", description: "Morcilla para la parrilla, paquete de 2.5 lb.", price: 19.8, size: "paquete 2.5 lb (1.13 kg)", image: "charcuteria-a-la-lena" },
    { id: "longaniza-chorizo-argentino", name: "Longaniza chorizo argentino", description: "Longaniza de chorizo argentino, paquete de 2.5 lb.", price: 19.56, size: "paquete 2.5 lb (1.13 kg)", image: "charcuteria-a-la-lena" },
    { id: "cuerda-parrillera-de-chorizo", name: "Cuerda parrillera de chorizo", description: "Cuerda parrillera de chorizo, paquete de 2 lb.", price: 15.83, size: "paquete 2 lb (907 g)", image: "charcuteria-a-la-lena" },
  ],
};

type Combo = { id: string; name: string; tagline: string; serves: 2 | 4; includes: string[]; regular: number; price: number };

/** `regular` es la suma de los precios sueltos (el precio tachado del PDF); `price`, el precio del combo. */
const COMBOS: Combo[] = [
  { id: "noche-de-ribeye", name: "Noche de Ribeye", tagline: "La cena clásica de steakhouse", serves: 2, includes: ["2 ribeye boneless CHOICE de 12 oz"], regular: 29.87, price: 27.99 },
  { id: "parrilla-criolla-para-dos", name: "Parrilla Criolla para Dos", tagline: "Sabor de parrillada en casa", serves: 2, includes: ["2 churrascos de vacío de 300 g", "1 cuerda parrillera de chorizo (2 lb)"], regular: 40.77, price: 38.99 },
  { id: "dos-cortes-dos-gustos", name: "Dos Cortes, Dos Gustos", tagline: "Para quien quiere probar de todo", serves: 2, includes: ["1 ribeye lip-on de 300 g", "1 lomo de tira Angus de 300 g", "1 paquete de longaniza argentina"], regular: 47.13, price: 44.99 },
  { id: "experiencia-fuego-lento", name: "Experiencia Fuego Lento", tagline: "Un gran corte para compartir", serves: 2, includes: ["1 ribeye EXPORT de 1 kg", "1 paquete de morcilla"], regular: 68.34, price: 64.99 },
  { id: "seleccion-premium", name: "Selección Premium", tagline: "Lo mejor del CHOICE", serves: 4, includes: ["2 ribeye lip-on de 300 g", "2 chuletones lip-on de 300 g", "1 cuerda parrillera de chorizo"], regular: 75.26, price: 68.99 },
  { id: "steak-night", name: "Steak Night", tagline: "Dos steaks por persona", serves: 4, includes: ["4 filetes ribeye roll de 10 oz", "4 filetes de lomo de 8 oz", "1 cuerda parrillera de chorizo"], regular: 75.67, price: 69.99 },
  { id: "parrillada-familiar", name: "Parrillada Familiar", tagline: "La parrillada completa", serves: 4, includes: ["4 churrascos de vacío de 300 g", "1 paquete de longaniza argentina", "1 paquete de morcilla"], regular: 89.24, price: 81.99 },
  { id: "gran-parrillada-fuego-lento", name: "Gran Parrillada Fuego Lento", tagline: "Para celebrar en grande", serves: 4, includes: ["1 tapa de solomillo entera (~1.2 kg)", "2 lomos de tira Angus de 300 g", "2 chuletones de 10 oz", "Longaniza y morcilla"], regular: 121.67, price: 111.99 },
];

const comboToProduct = (c: Combo): Product => ({
  id: c.id,
  slug: c.id,
  name: c.name,
  shortDescription: c.tagline,
  description: c.tagline,
  categoryId: "combos",
  images: [],
  basePrice: c.price,
  compareAtPrice: c.regular,
  currency: "USD",
  line: "carnes",
  featured: false,
  available: true,
  tags: [],
  ingredients: [],
  allergens: [],
  serves: c.serves,
  includes: c.includes,
  ...(c.id === "experiencia-fuego-lento" || c.id === "gran-parrillada-fuego-lento" ? { priceNote: "pieza de peso variable · el peso indicado es aproximado", byWeight: true } : {}),
  optionGroups: [],
});

export const meatProducts: Product[] = [...Object.entries(MEAT).flatMap(([categoryId, items]) => items.map(toProduct(categoryId))), ...COMBOS.map(comboToProduct)];
