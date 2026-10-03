# Referencia: Autumn Coffee Shop

Análisis de https://autumn-crafted-brews-journeys.onrender.com/ como referencia de calidad para el rediseño de Fuego Lento.

Fuentes del análisis (octubre 2026):

- HTML guardado y su CSS compilado (`Autumn Coffee Shop · Café de tueste lento con delivery.html` y su carpeta `_files`).
- Chunk JS de la versión en vivo (`/assets/routes-*.js`), que contiene la lógica de animación, carrito y WhatsApp.
- Capturas a 1440 px y 390 px, con el carrito abierto.

> **Conclusión principal.** Autumn tiene muchos de los defectos que la especificación de Fuego Lento quiere eliminar: tarjetas con borde en casi todas las secciones, botón naranja repetido en cada producto, partículas animadas, cursor propio, animación letra a letra, cifras y testimonios inventados, y el mismo padding en todas las secciones.
> Lo que se debe trasladar es su **sistema tipográfico, su paleta contenida, sus acabados finos y algunos movimientos concretos**. Su composición no.

---

## 1. Estructura de la página

| # | Sección | Fondo | Composición |
|---|---|---|---|
| — | Barra de progreso, cursor propio, header fijo | — | Header transparente, `h-16` / `lg:h-20` |
| 1 | Hero `#top` | Foto al 45 % + degradado + `<canvas>` | Centrado, `100svh`. Orden: hoja-logo → etiqueta → h1 → frase con efecto máquina de escribir → 2 botones → flecha |
| 2 | Historia `#historia` | ink | Título a la izquierda y debajo **12 columnas en 5/4/3**:<br>• foto 4:5 (`lg:mt-16`)<br>• texto + 3 cifras con línea dorada a la izquierda<br>• foto 3:4 |
| 2b | Cita | Foto al 20 % con parallax | Frase centrada grande |
| 3 | Orígenes `#origenes` | espresso al 25 % | 2 columnas: 4 tarjetas en 2×2 (origen, altitud, notas) y mapa esquemático con pins que laten |
| 4 | Menú `#menu` | ink | Filtros y rejilla `sm:2 / lg:3` columnas con 12 productos |
| 5 | Especialidades `#especialidades` | espresso al 25 % | Filtros y rejilla bento de 4 columnas (algunas tarjetas en `col-span-2`) con barra de porcentaje |
| 6 | Experiencia | Foto al 7 % con parallax | Carrusel que sangra por la derecha (`pl` alineado al contenedor). Tarjetas 3:4 de `w-[78vw]` / `sm:42vw` / `lg:26vw`, degradado vino, flechas arriba a la derecha |
| 7 | Testimonios | espresso al 40 % | Marquee automático infinito con máscara en los bordes y 5 estrellas |
| 8 | Club | ink | Centrado: título y formulario de nombre y correo con etiquetas flotantes |
| 9 | Delivery `#delivery` | espresso al 25 % | 2 columnas:<br>• mapa cuadrado con radios<br>• lista de zonas (precio y tiempo) y 4 pasos en timeline vertical |
| 10 | Footer | ink + grano | 3 columnas (marca y dirección · navegación · newsletter y redes), línea fina, copyright |
| — | Barra fija inferior (`sm:hidden`) | ink al 90 % con blur | "Pedir ahora" → "Ver pedido · N" |
| — | Pop-up al entrar | — | "Tu primer café con 15 % off · OTOÑO15" |

**Ritmo.** Los fondos alternan ink y espresso. **El padding es el mismo en todas las secciones**: `py-24 sm:py-32` (96 / 128 px). Casi todas siguen el mismo patrón: etiqueta, título a la izquierda y rejilla debajo. Solo Historia tiene una composición realmente editorial.

**Contenedor.** `max-w-7xl` (1280 px) con `px-5 sm:px-6`. A 1440 px el contenido empieza en x = 104.

---

## 2. Tipografía

Solo dos familias, y **ninguna sans**:

- **Display: Cormorant Garamond, peso 300 (light).** Fuego Lento ya la usa, pero en peso 500.
- **Interfaz y lectura: JetBrains Mono.** Es la fuente por defecto del `body`.

Su carácter sale del contraste entre una serif light grande y una mono pequeña, espaciada y en mayúsculas.

| Elemento | Valores |
|---|---|
| H1 hero | `clamp(2.6rem, 11vw, 6.5rem)`, line-height .95, tracking −0.01em, `text-wrap: balance`. La segunda línea va en dorado |
| H2 (todas las secciones) | `clamp(2rem, 7vw, 4rem)`, line-height 1.25. **Es la misma escala en todas** |
| Cita | `clamp(1.6rem, 5.5vw, 3.2rem)` |
| Títulos de tarjeta | Serif `text-2xl` (24 px) |
| Cifras | Serif `text-4xl` / `sm:text-5xl`, dorado |
| Eyebrow | Mono 11 px, tracking 0.3em, mayúsculas, dorado |
| Navegación | Mono 11 px, tracking 0.22em, crema al 80 %. Subrayado dorado que crece de izquierda a derecha en 0.32s |
| Botones | Mono 12 px, tracking 0.18em, mayúsculas |
| Filtros | Mono 11 px, tracking 0.18em |
| Párrafos | Mono 12–14 px, line-height 1.625, color apagado. **Difícil de leer** |
| Precios | Mono 14 px, dorado |
| Microetiquetas | Mono 9–10 px, tracking 0.2em |
| Logo | "AUTUMN" en serif, tracking 0.35em |

---

## 3. Color

Los valores originales están en OKLCH. Hex aproximado:

| Token | OKLCH | Hex | Uso |
|---|---|---|---|
| ink | `19% .006 60` | `#161311` | Fondo base |
| espresso | `31% .062 52` | `#48260f` | Fondos alternos al 25–40 % y tarjetas |
| gold | `73% .075 78` | `#c2a271` | Acento principal: etiquetas, precios, bordes, líneas finas, filtro activo |
| amber | `62% .157 52` | `#cd6508` | Botón primario y estrellas |
| wine | `38% .152 28` | `#800508` | Botón secundario, degradado de fotos, icono de eliminar |
| olive | `45% .055 118` | `#525a36` | Insignias de producto y categoría |
| cream | `91% .032 78` | `#eddfca` | Texto principal |
| muted-fg | `72% .025 75` | `#aea394` | Texto secundario |
| border | gold / .22 | — | Bordes al 15–30 % |

Hay unos seis colores, todos cálidos. El dorado hace casi todo el trabajo de acento; ámbar y vino solo aparecen en botones.

---

## 4. Formas y componentes

- **Radios casi rectos.** `--radius: .25rem`: 2 px en botones y 4 px en tarjetas. Ese ángulo seco aporta mucho a la sensación editorial.
- **`.btn-base`**
  - `min-height: 48px`, mono en mayúsculas, `padding: 0 1.5rem`, `border-radius: 2px`.
  - `::before` con un **brillo diagonal en bucle cada 4s**.
  - Hover: `scale(1.03)` y halo dorado (`0 0 0 1px gold/.35, 0 18px 50px -20px gold/.45`).
  - Active: `scale(.97)`.
- **`.btn-gold`** fondo ámbar, texto ink; en hover cambia a dorado. **`.btn-wine`** fondo vino, texto crema.
- **`.card-lux`**
  - Fondo `linear-gradient(160deg, espresso/.55, ink/.8)`, borde gold/.18, radio 4 px.
  - Hover: `translateY(-6px)`, borde gold/.6 y halo dorado.
  - Inclinación 3D (`perspective: 1000px`).
- **Tarjeta de producto**
  - Imagen 4:3; en hover la imagen pasa de 1 a 1.10 en 700 ms.
  - Degradado `from-ink/85` e insignia oliva arriba a la izquierda (mono 9 px).
  - Fila con nombre en serif y precio en mono; descripción de una línea.
  - Botón ámbar a todo el ancho, "+ Añadir al pedido", que pasa a "✓ Añadido" en estilo fantasma.
- **Filtros**
  - Rectangulares, `min-h-11`.
  - Activo del menú: fondo dorado sólido y texto ink.
  - Activo de especialidades: borde gold/.6 y fondo gold/.15.
  - El indicador se desplaza entre filtros con `layoutId`.
- **`.hairline`** `linear-gradient(90deg, transparent, gold/.6, transparent)`, 1 px.
- **`.grain`** ruido SVG (`feTurbulence`) al 5 %, solo en el hero y el footer.
- **Inputs** solo con línea inferior y etiqueta mono que flota al enfocar (`peer-focus`).
- **Iconos** Lucide dentro de cuadrados de 44 px con borde gold/.3.
- **`.glass-wine`** (testimonios) `backdrop-filter: blur(14px)` sobre espresso/.45.

---

## 5. Movimiento

La curva base es `--ease-signature: cubic-bezier(.22, 1, .36, 1)`. Un hook propio desactiva casi todo con `prefers-reduced-motion`.

| Efecto | Parámetros |
|---|---|
| Scroll suave (Lenis, carga diferida) | `duration: 1.2`, easing exponencial |
| Barra de progreso | 2 px dorada arriba, `useSpring` (stiffness 200, damping 40, mass .3) |
| Cursor propio | Punto dorado de 8 px que crece sobre enlaces y botones. Solo con puntero fino |
| Hojas en canvas (hero) | 140 hojas (60 en móvil) en 4 colores. Huyen del cursor, estallan al hacer clic y se inclinan con el giroscopio |
| Título letra a letra | Cada letra pasa de y 110 % a 0 en 0.55s, **+30 ms por letra**. `once`, margin −40px |
| Aparición genérica | Opacidad 0 y y 30 px → 0.6s. `once`, margin −60px |
| Revelado de imagen | `clip-path: inset(100% 0 0 0)` → `inset(0)` en 0.9s con curva `[.77, 0, .175, 1]`; zoom de 1.2 a 1 en 1.2s |
| Parallax | Fondo de la cita −8 %, fondo de Experiencia +6 % |
| Máquina de escribir | Alterna 2 frases con cursor parpadeante |
| Contadores | Las cifras de Historia cuentan hacia arriba |
| Pins del mapa | `pulse-ring` de 2.2s en bucle |
| Testimonios | Marquee infinito automático |
| Drawer | Spring (stiffness 300, damping 30). Las líneas entran con x 30 y salen con x 40 y height 0 |
| Pulsación | `whileTap` de 0.85 a 0.97 según el control |
| Toasts | react-hot-toast arriba ("Cappuccino de Otoño añadido") |

---

## 6. Flujo comercial

- El carrito se guarda en `localStorage` con Zustand `persist`.
- **El checkout entero vive dentro del drawer:**
  - Líneas con − / cantidad / + / eliminar.
  - Botones Delivery / Recogida.
  - Campos: Nombre, Teléfono, Dirección (solo con delivery) y Notas.
  - Subtotal y envío en mono; total en serif de 30 px.
- Solo valida nombre y teléfono; si faltan, muestra un toast de error.
- Abre `https://wa.me/57XXXXXXXXXX?text=…`. **El número es un marcador sin rellenar.** El mensaje lleva emojis (🛒 👤 📞 📍 🏠 🛵).
- **Errores a no repetir:**
  - El envío es fijo ($6.000) y no tiene relación con las zonas que muestra la sección Delivery.
  - Muestra **"¡Pedido enviado!"** y **vacía el carrito a los 3s**, sin saber si el mensaje se envió.
  - No hay personalización de producto.
- En móvil, la barra fija inferior muestra el contador del pedido.

---

## 7. Fotografía

- Son **9 imágenes en total, muy reutilizadas**: cappuccino ×3, saco de granos ×4, cold brew ×2.
- Estética de imagen generada: fondo negro, luz lateral cálida, hojas de otoño como atrezzo y gradación cálida uniforme. Por eso el conjunto se ve coherente aunque se repita.
- En el hero la foto apenas se ve (opacidad .45 más degradado): funciona como textura, no como protagonista.

---

## 8. Qué trasladar a Fuego Lento

### Adoptar (adaptado)

1. **Contraste serif light + mono en la interfaz.**
   - Cormorant en 300–400 para títulos.
   - Una mono **solo** para etiquetas, precios, filtros, botones y estados.
   - **Manrope para los párrafos**, para no repetir el problema de leer mono a 12 px.
2. Etiquetas mono de 11 px con tracking ~0.3em.
3. Radios de 2–4 px en lugar de 10–16 px.
4. Un único acento dominante (cobre o ámbar) para líneas finas, precios y estados. El rojo brasa queda reservado al CTA principal.
5. Revelado de imágenes con `clip-path`, respetando reduced motion.
6. Carrusel que sangra por la derecha, alineado al contenedor.
7. Composición 12 columnas 5/4/3 con desplazamientos verticales, como en Historia.
8. Listas con líneas finas en lugar de tarjetas (zonas, pasos).
9. Drawer con título en serif y total grande en serif.
10. Barra móvil "Ver pedido · N" con safe area.

### No copiar

- Hojas o partículas en canvas, cursor propio, título letra a letra, máquina de escribir.
- Brillo de botón en bucle e inclinación 3D en las tarjetas.
- Cifras inventadas, barras de porcentaje y testimonios.
- Pop-up de descuento, club y newsletter sin backend, enlaces sociales a `#`.
- Hero centrado con la foto apagada. En Fuego Lento: texto a la izquierda y producto a la derecha.
- Misma escala de H2 y mismo padding en todas las secciones.
- Botón de color repetido en cada tarjeta.
- Envío sin relación con las zonas.
- Afirmar "pedido enviado" y vaciar el carrito.
