# Fuego Lento Steakhouse · Web de pedidos

Next.js 16 + TypeScript + Tailwind 4 + Zustand + Zod. Sitio estático (`output: "export"`).

```bash
npm install
npm run dev            # desarrollo (vista previa con datos de ejemplo)
npm run build          # versión PÚBLICA → out/
npm run build:preview  # VISTA PREVIA del diseño para presentar → out-preview/
```

## Dos versiones, una regla
**Si un dato no está confirmado, se oculta.**
- **Pública** (`npm run build`): la web real. Estado, horario y carta salen de `config/restaurant.ts` y `data/`. Sin panel "Escenario".
- **Vista previa** (`npm run build:preview`, `NEXT_PUBLIC_PREVIEW=1`): añade el botón "Escenario" para ver tienda abierta, cerrada por reparaciones o próxima reapertura. Nunca se indexa.

## Dos formas de comprar
- **Platos preparados**: la carta del restaurante (`data/products.ts`), precios en CUP.
- **Carnes para cocinar**: cortes, embutidos y combos crudos (`data/carnes.ts`), precios en USD con equivalente aproximado en CUP. Sin fotos hasta tener las de cada pieza (`SHOW_PHOTOS` en ese archivo).
- Se pueden combinar en un pedido: cada tipo mantiene su moneda y no se suman entre sí.

## Estado comercial (un solo sitio)
`config/restaurant.ts` → `storefront`: `status`, `orderingEnabled`, `hoursStatus` (`confirmed | pending | unavailable`), `coverageEnabled`, `menuApproved`, `pricesConfirmed`, `reopeningSignupEnabled`, `faqRouteEnabled`, `historyApproved`.
Todos los componentes leen `useStoreStatus()` (`lib/storefront.ts`); ninguno decide por su cuenta.

Para abrir la tienda con datos reales: reemplaza `data/` y `config/`, y pon `menuApproved`, `pricesConfirmed`, `orderingEnabled`, `coverageEnabled` y `hoursStatus: "confirmed"` cuando el restaurante lo confirme.

## Flujo de pedido por WhatsApp
Platos preparados / Carnes para cocinar → Añadir o Elegir opciones → **Mi pedido** (panel lateral) → **Enviar pedido por WhatsApp**.
La web **no confirma ni envía** el pedido: genera un resumen y abre WhatsApp; el restaurante confirma disponibilidad, entrega y pago allí. El pedido no se vacía al abrir WhatsApp (hay "Copiar resumen" y "Vaciar pedido").
No hay pedido mínimo, programación de pedidos, zonas ni tarifas de envío: el envío aparece como "se confirma por WhatsApp" y existe recogida en el local. El pago se coordina por WhatsApp.
Los cortes de la carta a la parrilla piden término de cocción (poco hecho, medio, tres cuartos, bien hecho); las carnes crudas no.
El número sale de `NEXT_PUBLIC_WHATSAPP_NUMBER` o, si no existe, de `config/restaurant.ts`. El pedido y el borrador se guardan en este dispositivo (localStorage, con versión).

## Dónde se edita
| Qué | Archivo |
|---|---|
| Estado comercial, contacto, horarios | `config/restaurant.ts` |
| Textos | `config/content.ts` |
| Productos / categorías | `data/products.ts`, `data/carnes.ts`, `data/categories.ts` |
| Alérgenos (deducidos de los ingredientes) | `data/allergens.ts` |
| Preguntas frecuentes / textos legales | `data/faq.ts`, `data/legal.ts` |
| Testimonios reales (vacío = sección oculta) | `data/testimonials.ts` |
| WhatsApp | `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| Reglas visuales (color, botones, enlaces, filtros, comanda) | `docs/sistema-visual.md` |

## Límites
Es estática: los totales se recalculan en el navegador y el pedido se envía por WhatsApp. El registro de reapertura, la capacidad por franja y los cupones requieren backend. Las fotografías son referencias libres (Unsplash); hay que sustituirlas por fotos propias.
