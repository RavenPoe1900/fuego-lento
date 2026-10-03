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
- **Pública** (`build`): solo muestra lo confirmado. Hoy: "Temporalmente cerrado por reparaciones", Instagram y enlaces. Sin menú, precios, horarios, zonas ni botones de compra.
- **Vista previa** (`build:preview`): enseña el diseño completo con datos de ejemplo bajo una franja que lo indica. Incluye un botón "Escenario" para ver tienda abierta, cerrada por reparaciones o próxima reapertura. Nunca se indexa.

## Estado comercial (un solo sitio)
`config/restaurant.ts` → `storefront`: `status`, `orderingEnabled`, `hoursStatus` (`confirmed | pending | unavailable`), `coverageEnabled`, `menuApproved`, `pricesConfirmed`, `reopeningSignupEnabled`, `faqRouteEnabled`, `historyApproved`.
Todos los componentes leen `useStoreStatus()` (`lib/storefront.ts`); ninguno decide por su cuenta.

Para abrir la tienda con datos reales: reemplaza `data/` y `config/`, y pon `menuApproved`, `pricesConfirmed`, `orderingEnabled`, `coverageEnabled` y `hoursStatus: "confirmed"` cuando el restaurante lo confirme.

## Flujo de pedido por WhatsApp
Menú → Añadir/Personalizar → carrito lateral → checkout (Tu pedido · Entrega · Confirmar) → **Enviar pedido por WhatsApp**.
La web **no confirma ni envía** el pedido: genera un resumen y abre WhatsApp; el restaurante confirma disponibilidad, importe y entrega allí. El carrito no se vacía al abrir WhatsApp (hay "Copiar resumen" y "Vaciar pedido").

Para activarlo hacen falta, en `config/restaurant.ts` → `storefront`: `status: "open"`, `orderingEnabled: true`, `whatsappOrderingEnabled: true`, `menuApproved` y `pricesConfirmed`, **y** el número en `NEXT_PUBLIC_WHATSAPP_NUMBER` con código de país (p. ej. `+53 5XXX XXXX`). Si falta cualquiera, el menú queda como catálogo.
Opcionales: `paymentMethodsConfirmed` (muestra "Método de pago preferido"; si no, el mensaje dice "Pago: por coordinar"), `hoursStatus: "confirmed"` (habilita pedidos programados) y la `fee` de cada zona (`null` = "Envío por confirmar", nunca se suma).
El carrito y el borrador de datos se guardan en este dispositivo (localStorage, con versión).

## Dónde se edita
| Qué | Archivo |
|---|---|
| Estado comercial, contacto, horarios, pagos | `config/restaurant.ts` |
| Textos | `config/content.ts` |
| Productos / categorías / zonas | `data/products.ts`, `data/categories.ts`, `data/delivery-zones.ts` |
| Testimonios reales (vacío = sección oculta) | `data/testimonials.ts` |
| WhatsApp | `NEXT_PUBLIC_WHATSAPP_NUMBER` |

## Límites
Es estática: los totales se recalculan en el navegador y el pedido se envía por WhatsApp. El registro de reapertura, la capacidad por franja y los cupones requieren backend. Las fotografías son referencias libres (Unsplash); hay que sustituirlas por fotos propias.
