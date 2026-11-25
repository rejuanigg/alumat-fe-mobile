# ALUMAT — Manual de Identidad Visual

> Fuente de verdad: `src/theme/tokens.ts`, `src/components/Icon.tsx`, `src/components/Logo.tsx` y `assets/`.
> Fábrica de aberturas (ventanas, puertas, persianas y accesorios). App móvil de gestión.

---

## 1. Esencia de marca

| | |
|---|---|
| **Nombre** | ALUMAT (siempre en mayúsculas) |
| **Rubro** | Aberturas de aluminio: ventanas, puertas, persianas, accesorios |
| **Personalidad** | Sólida, precisa, confiable, moderna |
| **Concepto gráfico** | La **abertura**: un marco con vidrio azul y un reflejo diagonal |
| **Tono visual** | Azules profundos, mucho blanco, formas limpias y geometría arquitectónica |

---

## 2. Logotipo

### 2.1 Componentes

| Elemento | Archivo | Tamaño | Uso |
|---|---|---|---|
| **Isotipo (ícono de app)** | `assets/icon.png` | 1254×1254 | Ícono de la app, splash, junto al logotipo |
| **Isotipo sobre fondo claro** | `assets/isotipo.png` | 1264×1244 | Versión con contornos navy y vidrio azul degradado |
| **Logo reducido** | `assets/logo.png` | 256×256 | Usos pequeños |
| **Favicon** | `assets/favicon.png` | 48×48 | Pestaña del navegador (web) |
| **Splash** | `assets/splash-icon.png` | 1024×1024 | Pantalla de carga |
| **Android adaptive** | `assets/android-icon-foreground.png` / `-background.png` / `-monochrome.png` | 512 / 512 / 432 | Ícono adaptativo de Android |
| **Imagen institucional** | `assets/edificio.png` | 1315×1196 | Fachada vidriada azul; se usa como fondo en el login |

### 2.2 Descripción del isotipo
Un marco blanco de perfil 3D con contorno **navy**, que encierra un vidrio en **azul** con dos franjas diagonales claras (reflejo). A la izquierda se ve el lateral del marco, que da profundidad. Representa una ventana entreabierta.

### 2.3 Lockup horizontal (isotipo + palabra)
- Isotipo a la izquierda, palabra **ALUMAT** a la derecha, separados por **8 px**.
- Tipografía: Figtree ExtraBold (800), `letterSpacing: 1.3`.
- Tamaño de la palabra = **70 %** del tamaño del isotipo (isotipo 26 px → texto ≈ 18 px).
- Tamaño por defecto del isotipo: **26 px**.

| Fondo | Texto | Isotipo |
|---|---|---|
| Claro (`#FFFFFF`, `#F4F6F9`) | Navy `#0B2A4F` | Colores originales |
| Oscuro (navy `#0B2A4F`) | Blanco `#FFFFFF` | Colores originales, o monocromático blanco (`tintColor`) |

### 2.4 Reglas de uso
- ✅ Respetar las proporciones; no deformar ni rotar.
- ✅ Dejar alrededor del logo un margen mínimo igual al **alto de la "A"**.
- ✅ Sobre fotos, usar un velo navy (`overlay`) para asegurar contraste.
- ❌ No cambiar los colores del isotipo ni la tipografía de la palabra.
- ❌ No agregar sombras, brillos ni efectos.
- ❌ No usar la palabra en minúsculas ("Alumat", "alumat").

---

## 3. Paleta de colores

### 3.1 Colores institucionales (principales)

| Color | HEX | RGB | Token | Uso |
|---|---|---|---|---|
| ![](https://placehold.co/60x24/0B2A4F/0B2A4F.png) **Azul Navy** | `#0B2A4F` | 11, 42, 79 | `navy` | Color de marca. Fondo de splash y héroes, logotipo |
| ![](https://placehold.co/60x24/1D5FD1/1D5FD1.png) **Azul ALUMAT** | `#1D5FD1` | 29, 95, 209 | `blue` | Acción principal: botones, foco de campos, elementos activos |
| ![](https://placehold.co/60x24/0F2547/0F2547.png) **Tinta** | `#0F2547` | 15, 37, 71 | `ink` | Títulos y texto principal. Color por defecto de íconos |

### 3.2 Azules de apoyo

| Color | HEX | RGB | Token | Uso |
|---|---|---|---|---|
| ![](https://placehold.co/60x24/1D4FB0/1D4FB0.png) Azul enlace | `#1D4FB0` | 29, 79, 176 | `link` | Enlaces de texto |
| ![](https://placehold.co/60x24/B9CCF0/B9CCF0.png) Azul suave | `#B9CCF0` | 185, 204, 240 | `navySoft` | Texto secundario sobre navy |
| ![](https://placehold.co/60x24/DCE8FB/DCE8FB.png) Relleno activo | `#DCE8FB` | 220, 232, 251 | `fillFilled` | Campos con contenido |
| ![](https://placehold.co/60x24/E7EEFB/E7EEFB.png) Tinte azul | `#E7EEFB` | 231, 238, 251 | `tintBlue` | Fondos de íconos, chips, selección |

### 3.3 Neutros

| Color | HEX | RGB | Token | Uso |
|---|---|---|---|---|
| ![](https://placehold.co/60x24/FFFFFF/FFFFFF.png) Blanco | `#FFFFFF` | 255, 255, 255 | `surface` / `white` | Tarjetas, superficies, texto sobre navy |
| ![](https://placehold.co/60x24/F4F6F9/F4F6F9.png) Fondo | `#F4F6F9` | 244, 246, 249 | `bg` | Fondo general de pantallas |
| ![](https://placehold.co/60x24/EEF1F6/EEF1F6.png) Relleno | `#EEF1F6` | 238, 241, 246 | `fill` | Campos de texto vacíos |
| ![](https://placehold.co/60x24/E3E8EF/E3E8EF.png) Línea | `#E3E8EF` | 227, 232, 239 | `line` | Bordes y divisores |
| ![](https://placehold.co/60x24/5B6B85/5B6B85.png) Gris azulado | `#5B6B85` | 91, 107, 133 | `muted` | Texto secundario, placeholders, íconos inactivos |

### 3.4 Colores de estado (semánticos)

| Estado | Texto / ícono | Fondo | Extra | Uso |
|---|---|---|---|---|
| **Error** | `#B3261E` | `#FBEDEC` | — | Validaciones, errores, eliminar |
| **Éxito** | `#14572A` | `#E6F4EA` | `#2FA55A` (check) | Confirmaciones, pantalla "Listo" |
| **Advertencia** | `#7A4B00` | `#FFF4DB` | `#E0A000` (ilustraciones) | Avisos, banners informativos |

### 3.5 Transparencias
| Token | Valor | Uso |
|---|---|---|
| `overlay` | `rgba(15, 37, 71, 0.55)` | Velo detrás de bottom sheets y modales |

### 3.6 Proporción de uso sugerida
- **60 %** Blancos y neutros (`surface`, `bg`, `fill`)
- **30 %** Navy y tinta (héroes, títulos, texto)
- **10 %** Azul ALUMAT (acciones y acentos) — **un solo CTA primario por pantalla**

### 3.7 Contraste (WCAG)

| Combinación | Ratio | Nivel |
|---|---|---|
| Tinta `#0F2547` sobre blanco | 15.3 : 1 | AAA |
| Tinta `#0F2547` sobre fondo `#F4F6F9` | 14.1 : 1 | AAA |
| Blanco sobre navy `#0B2A4F` | 14.4 : 1 | AAA |
| Azul suave `#B9CCF0` sobre navy | 8.9 : 1 | AAA |
| Enlace `#1D4FB0` sobre blanco | 7.5 : 1 | AAA |
| Éxito `#14572A` sobre `#E6F4EA` | 7.6 : 1 | AAA |
| Advertencia `#7A4B00` sobre `#FFF4DB` | 6.8 : 1 | AA |
| Azul ALUMAT `#1D5FD1` sobre blanco | 5.8 : 1 | AA |
| Error `#B3261E` sobre `#FBEDEC` | 5.7 : 1 | AA |
| Gris azulado `#5B6B85` sobre blanco | 5.4 : 1 | AA |

Todos los pares cumplen al menos AA (4.5 : 1) para texto normal.

---

## 4. Tipografía

**Familia: Figtree** (Google Fonts, paquete `@expo-google-fonts/figtree`). Sans-serif geométrica, legible y amigable.

### 4.1 Pesos

| Peso | Nombre | Token | Uso |
|---|---|---|---|
| 400 | Regular | `Figtree_400Regular` | Texto corrido |
| 500 | Medium | `Figtree_500Medium` | Énfasis suave |
| 600 | SemiBold | `Figtree_600SemiBold` | Etiquetas de campos |
| 700 | Bold | `Figtree_700Bold` | Botones, texto destacado |
| 800 | ExtraBold | `Figtree_800ExtraBold` | Títulos y logotipo |

### 4.2 Escala tipográfica

| Estilo | Peso | Tamaño / interlineado | Tracking | Uso |
|---|---|---|---|---|
| `display` | 800 | 46 / 48 | −1.5 | Pantallas de bienvenida |
| `title40` | 800 | 40 / 42 | −1.2 | Títulos grandes |
| `title34` | 800 | 34 / 37 | −1.0 | Títulos de pantalla |
| `title28` | 800 | 28 / 31 | −0.6 | Subtítulos de pantalla |
| `heading` | 800 | 20 / 25 | −0.3 | Encabezados de sección |
| `bodyLarge` | 400 | 16 / 22 | 0 | Texto destacado |
| `body` | 400 | 15 / 21 | 0 | Texto general |
| `bodyStrong` | 700 | 16 / 21 | 0 | Texto con énfasis |
| `label` | 600 | 13 / 17 | 0 | Etiquetas de campos |
| `small` | 400 | 13 / 17 | 0 | Notas, ayudas, errores |
| `button` | 700 | 16 / 20 | 0 | Texto de botones |
| `logo` | 800 | 18 | +1.3 | Palabra ALUMAT |

**Regla:** los títulos (800) llevan *letter-spacing* negativo, más cerrado cuanto más grande el cuerpo. El logotipo es la excepción: tracking positivo.

---

## 5. Iconografía

### 5.1 Estilo
- Íconos **de línea (outline)**, trazados en SVG sobre una grilla de **24 × 24 px**.
- Trazo **2 px**, terminaciones y uniones **redondeadas** (`round` / `round`).
- Sin relleno (`fill: none`).
- Tamaño por defecto: **24 px**. Color por defecto: tinta `#0F2547`.
- Componente: `<Icon name="…" size={24} color={…} strokeWidth={2} />`

### 5.2 Colores de ícono

| Contexto | Color |
|---|---|
| Normal | Tinta `#0F2547` |
| Activo / acción | Azul `#1D5FD1` |
| Inactivo / secundario | Gris azulado `#5B6B85` |
| Sobre navy | Blanco `#FFFFFF` |
| Error / eliminar | `#B3261E` |
| Éxito | `#2FA55A` |

### 5.3 Set de íconos (15)

| Nombre | Descripción | Dónde se usa |
|---|---|---|
| `back` | Flecha izquierda `‹` | Volver |
| `eye` | Ojo | Mostrar contraseña |
| `eyeOff` | Ojo tachado | Ocultar contraseña |
| `check` | Tilde ✓ | Confirmación, checkbox |
| `search` | Lupa | Buscador de productos |
| `edit` | Lápiz | Editar producto o perfil |
| `trash` | Tacho | Eliminar |
| `home` | Casa | Tab Inicio |
| `box` | Cuadrícula de 4 cuadrados | Tab Productos |
| `grid` | Cuadrado dividido en 4 | Disponible en el set (sin uso actual en pantallas) |
| `user` | Persona (cabeza + hombros) | Tab Perfil |
| `plus` | Más `+` | Agregar producto |
| `image` | Marco con sol y montaña | Campo de selección de imagen (azul; rojo si hay error) |
| `chevronDown` | Flecha abajo `⌄` | Selectores desplegables |
| `chevronRight` | Flecha derecha `›` | Disponible en el set (sin uso actual en pantallas) |

### 5.4 Navegación inferior (tab bar)

| Tab | Ícono |
|---|---|
| Inicio | `home` |
| Productos | `box` |
| Perfil | `user` |

Altura de la barra: **68 px**. Zona táctil mínima: **44 px**.

### 5.5 Especificaciones SVG (para diseño en Figma / Illustrator)

```
viewBox="0 0 24 24"   stroke-width="2"   stroke-linecap="round"   stroke-linejoin="round"   fill="none"
```

| Ícono | Trazado (`d`) |
|---|---|
| back | `M15 5l-7 7 7 7` |
| check | `M5 12.5l4.5 4.5L19 7.5` |
| edit | `M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4` |
| trash | `M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5` |
| home | `M3.5 10.5L12 4l8.5 6.5V20h-5.5v-6h-6v6H3.5z` |
| plus | `M12 5v14M5 12h14` |
| chevronDown | `M6 9l6 6 6-6` |
| chevronRight | `M9 6l6 6-6 6` |
| eye | `M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z` + círculo `cx12 cy12 r3` |
| search | círculo `cx11 cy11 r6.5` + `M20 20l-4.2-4.2` |
| user | círculo `cx12 cy8 r4` + `M4 20.5c1.4-3.7 4.4-5.5 8-5.5s6.6 1.8 8 5.5` |
| box | 4 rectángulos `7×7`, `rx1`, en (4,4) (13,4) (4,13) (13,13) |
| grid | rectángulo `16×16` en (4,4) `rx1.5` + `M12 4v16M4 12h16` |
| image | rect `17×15` en (3.5,4.5) `rx1.5` + círculo `cx9 cy10 r1.8` + `M20.5 16l-5-5-9 8.5` |
| eyeOff | ver `src/components/Icon.tsx` |

---

## 6. Espaciado, formas y medidas

### 6.1 Espaciado (múltiplos de 4)

| Token | px | Uso típico |
|---|---|---|
| `xxs` | 4 | Separación mínima |
| `xs` | 8 | Ícono ↔ texto |
| `sm` | 12 | Entre elementos relacionados |
| `md` | 16 | Padding interno |
| `lg` | 20 | Entre grupos |
| `xl` | 24 | Márgenes laterales de pantalla (`screen`) |
| `xxl` | 32 | Entre secciones |

### 6.2 Radios de borde

| Token | px | Uso |
|---|---|---|
| `field` | 8 | Campos de texto |
| `button` | 8 | Botones |
| `card` | 10 | Tarjetas |
| `list` | 12 | Filas de lista |
| `sheet` | 12 | Bottom sheets |
| `round` | 999 | Avatares, chips, círculos |

### 6.3 Medidas de componentes

| Elemento | Medida |
|---|---|
| Ancho de diseño base | 390 px |
| Campo de texto | 52 px de alto |
| Botón grande | 56 px de alto |
| Área táctil mínima | 44 px |
| Tab bar | 68 px |
| Onda decorativa (`Wave`) | 40 px de alto, solapa 39 px sobre el héroe |

---

## 7. Elementos gráficos

### 7.1 La onda (Wave)
Curva suave que separa el **héroe navy** del contenido blanco. Es el elemento distintivo de las pantallas de acceso.
- Viewbox `390 × 40`, trazado: `M0 26 C 70 -6, 130 -6, 195 18 S 330 46, 390 8 V40 H0 Z`
- Relleno: blanco (`surface`), solapada sobre el borde inferior del héroe.

### 7.2 Imagen institucional
`assets/edificio.png`: fachada de vidrio y aluminio en azules eléctricos sobre fondo negro (transparente). Se usa en el héroe del login para transmitir producto y rubro.

### 7.3 Héroe
Bloque superior en **navy `#0B2A4F`** con logo en blanco, título blanco (800) y subtítulo en azul suave `#B9CCF0`, rematado con la onda.

---

## 8. Componentes y aplicación

| Componente | Estilo |
|---|---|
| **Botón primario** | Fondo `#1D5FD1`, texto blanco `button` (700/16), radio 8, alto 56 |
| **Campo de texto** | Fondo `#EEF1F6`, con contenido `#DCE8FB`, foco con borde azul `#1D5FD1`, radio 8, alto 52 |
| **Enlace** | `#1D4FB0`, peso 600–700 |
| **Tarjeta / lista** | Fondo blanco, borde `#E3E8EF`, radio 10–12 |
| **Banner de error** | Fondo `#FBEDEC`, texto `#B3261E` |
| **Banner de éxito** | Fondo `#E6F4EA`, texto `#14572A` |
| **Banner de aviso** | Fondo `#FFF4DB`, texto `#7A4B00` |
| **Bottom sheet** | Fondo blanco, radio 12, velo `rgba(15,37,71,0.55)` |

---

## 9. Configuración de app (marca en plataformas)

| Elemento | Valor |
|---|---|
| Nombre | ALUMAT |
| Ícono | `assets/icon.png` |
| Splash | `assets/icon.png`, fondo `#0B2A4F` |
| Android adaptive — fondo | `#E6F4FE` |
| Favicon web | `assets/favicon.png` |

---

## 10. Resumen rápido

```
COLORES     Navy #0B2A4F · Azul #1D5FD1 · Tinta #0F2547 · Fondo #F4F6F9 · Blanco #FFFFFF
TIPOGRAFÍA  Figtree (400–800) · Títulos ExtraBold con tracking negativo
ÍCONOS      Outline 24px · trazo 2px · puntas redondeadas
FORMAS      Radios 8–12 px · onda decorativa en héroes
LOGO        Isotipo de ventana + ALUMAT (Figtree 800, +1.3 tracking)
```
