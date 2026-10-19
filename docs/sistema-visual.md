# Sistema visual de Fuego Lento

Reglas vigentes tras el rediseño ligero (inspirado en la delicadeza de contornos y la consistencia de pocos recursos de Sea Lights Design, sin copiar su paleta, fuentes ni símbolos). La referencia anterior está en [referencia-autumn.md](referencia-autumn.md).

## Color (tokens en `app/globals.css`)

| Uso | Token | Valor |
|---|---|---|
| CTA principal (relleno) | `--ember` / `--ember-hover` / `--ember-active` | `#b93a22` / `#bf3b23` / `#a8321c` |
| Acento de interfaz (selección, precios, líneas, flechas) | `--accent` (= `--gold`) | `#b98b58` |
| Disponible / confirmado | `--available` | `#7d9b70` |
| Error | `--error` | `#e0594b` |
| Texto pequeño sobre oscuro: oro, verde, error | `--gold-soft`, `--ok-soft`, `--err-soft` | `#e3bd88`, `#a9c79a`, `#f0867b` |
| Comanda (papel y tintas) | `--ticket`, `--ticket-muted`, `--ticket-rule`, `--ticket-alert` | `#e9dfce`, `#6b5a47`, `#8a7860`, `#7a2b1f` |

Reglas:
- **El rojo brasa es solo para la acción principal** (y el contador de la comanda). No se usa en filtros, selecciones ni decoración.
- **La selección es dorada** y nunca depende solo del color: subrayado en filtros, check en opciones, contorno en tarjetas.
- No se escriben colores sueltos en los componentes: si hace falta uno nuevo, es un token con una función clara.

### Contraste del CTA (texto crema `#f4ecdf` sobre brasa)

| Estado | Fondo | Ratio |
|---|---|---|
| Antes (reposo) | `#d6492f` | 3.69:1 (no cumplía AA) |
| Reposo | `#b93a22` | **4.85:1** |
| Hover | `#bf3b23` | **4.63:1** |
| Active | `#a8321c` | **5.71:1** |

El hover aclara solo lo que permite mantener 4.5:1. El botón se distingue del fondo `carbon` (3.45:1) y del terracota (3.08:1).

## Formas

- Superficies funcionales (tarjetas, campos, paneles): radio de 3–4 px.
- **Botones de acción: píldora** (`rounded-full`), en todas las variantes salvo el enlace de texto.
- Sin sombras de elevación ni escalados en hover/active. La jerarquía la dan relleno, borde y color.
- **Marco en arco rebajado** (`.frame-arch`): solo en la vista previa sticky de Especialidades (en la prueba inicial también se aplicó a la foto de ambiente del Manifiesto, sección que después se retiró de la home). Usa `border-radius`, así que convive con el revelado por `clip-path` (`RevealImage`) si se vuelve a usar con él. No se extiende al catálogo ni al hero.

## Componentes

- **Botón** (`components/shared/button.tsx`): `primary` (brasa), `secondary` (contorno crema), `soft` (contorno dorado, para acciones repetidas como "Añadir"), `ghost`, `link`. Alto mínimo de 46/50/54 px. `loading` no cambia el tamaño.
- **Enlace editorial** (`components/shared/arrow-link.tsx`): `ArrowLink` para navegar, `ArrowButton` para acciones. Texto en mono con subrayado fino y flecha larga dorada que se desplaza en hover (solo con `motion-safe`). `onLight` para fondos claros; `caps={false}` para textos largos.
- **Filtros** (`components/shared/chip.ts`): texto mono sin caja; el activo va en dorado con subrayado. Se separan con `gap-x-7`.
- **Tarjeta de producto**: borde fino, sin sombra ni desplazamiento. Acción "Añadir" en `soft`; al añadir, verde con check. En móvil es una fila compacta con acción de 44 px.
- **Comanda** (`components/cart/cart-ticket.tsx`): ticket de cocina sobre papel crema con borde dentado. Los datos por confirmar usan una superficie dorada tenue.
- **Header**: una sola entrada a la comanda (icono + contador; en escritorio, etiqueta y total).

## Carnes a domicilio y "Cómo pedir"

- **Tarjetas de Carnes** (`components/home/meat-cards.tsx`): foto arriba y panel de texto abajo, radio de 24 px (`rounded-panel`, token `--panel-radius`). Es la única superficie con ese radio. Los paneles alternan crema (`--paper`) y dos marrones (`--panel-brasa`, `--panel-ceniza`); en los marrones la foto es algo más alta. Toda la tarjeta es un enlace; el botón en píldora es solo visual. En móvil, carrusel con snap.
- **Cómo pedir** (`components/home/how-to-order.tsx`): banda de color liso (`paper`), título con barra "/" a la izquierda, etiquetas en mono a la derecha, foto ancha y tres pasos numerados. Sin tarjetas ni bordes. Textos en `content.howToOrder`.
- **Página `/carnes/`**: lista de precios en filas (nombre, medida, precio, acción) y combos en tarjetas de 3–4 px, como el resto de superficies funcionales.
- **Precios en dos monedas**: `Price` con `currency="USD"` y `dual` muestra el USD y debajo el equivalente en CUP. El cambio vive en `restaurant.fx.usdToCup` (o `NEXT_PUBLIC_USD_CUP_RATE`); **está pendiente de confirmar**. El carrito calcula siempre en CUP y guarda el importe original de cada línea para mostrarlo.


## Ajustes de la revisión integral (oct. 2026)
- **Dos familias tipográficas**: Cormorant (titulares) y Manrope (interfaz, etiquetas y precios). Se retiró IBM Plex Mono: `font-mono` ahora es Manrope.
- **Precio**: la cifra va en color de texto (no dorado) y la moneda explícita y discreta; el equivalente en CUP es secundario. El dorado queda para etiquetas, selección activa y acciones suaves.
- **Etiquetas fijas**: "Platos preparados" (carta, CUP) y "Carnes para cocinar" (USD). Se usan igual en navegación, encabezados, fichas, pedido y mensaje de WhatsApp.
- **Una sola entrada al pedido**: botón "Mi pedido" en la cabecera. Sin barra inferior móvil ni botón flotante.
- Se retiró el grano de fondo y el bloque "Fuego. Corte. Tiempo.". Las tarjetas de carnes son de texto hasta tener fotos propias.
