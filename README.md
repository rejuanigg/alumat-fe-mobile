# ALUMAT — app móvil

App de **ALUMAT** (fábrica de aberturas) hecha con **Expo + TypeScript**. Incluye:

1. Autenticación: login, registro, olvidé mi contraseña, código, nueva contraseña y pantalla "Listo".
2. Perfil y edición de perfil (con foto).
3. CRUD de **Productos** (listar, buscar, crear, editar, eliminar) con imagen.
4. Inicio con bienvenida, cifras del catálogo y accesos.

El backend está **simulado en memoria** (ver [Datos simulados](#datos-simulados-en-memoria)): no hace falta configurar ningún servicio externo.

## Requisitos

- Node.js 22 LTS o posterior y npm.
- Expo Go actualizado en el teléfono (SDK 58).

```text
node -v
npm -v
```

## Cómo correr la app

```text
npm ci
npx expo start
```

La computadora y el teléfono tienen que estar en la misma red Wi-Fi. Cuando aparezca el código QR, escanealo con Expo Go (Android) o con la cámara (iOS).

- **Web:** `npx expo start --web` (o presioná `w` con Expo abierto).
- **El QR no conecta:** `npx expo start --tunnel` (Expo ofrece instalar `@expo/ngrok` la primera vez).
- **Cambios que no aparecen o error de caché:** `npx expo start -c`.

### Con Docker (opcional)

```text
docker compose up --build
```

El contenedor sincroniza `node_modules` con `package-lock.json` al arrancar y levanta Expo con túnel. Para ver el QR: `docker compose logs -f expo`. Para frenarlo: `docker compose down`.

### Chequeos

```text
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint (config de Expo)
```

## Usuario de prueba

| Correo | Contraseña |
|---|---|
| `romina@alumat.com` | `Alumat2024` |

En "Olvidé mi contraseña" el código de verificación es siempre **`123456`**.

## Datos simulados en memoria

Todo vive en `src/services/db.ts` y **se pierde al recargar la app**:

| Qué | Dónde | Comportamiento actual |
|---|---|---|
| Usuarios y contraseñas | `db.users` | Romina Flores precargada; los registros nuevos se agregan a la lista. Las contraseñas se guardan en texto plano (solo para la demo). |
| Sesión | `AuthContext` | Solo en memoria: al cerrar la app hay que volver a iniciar sesión. |
| "Recordarme" | `db.rememberedEmail` | Precarga el correo en el Login mientras la app siga abierta. |
| Código de recuperación | `authService` (`DEMO_RESET_CODE`) | Siempre `123456`; no se envía ningún correo. |
| Productos | `db.products` | Los 5 productos de ejemplo; crear, editar y eliminar modifican la lista. |
| Imágenes (producto y perfil) | campos `imageUri` / `photoUri` | Se guarda la URI local del archivo elegido; no se sube a ningún servidor. |
| Latencia | `delay()` | Cada llamada espera 200–350 ms para simular la red. |

## Cómo conectarla a una API real

Las pantallas no tocan `db` directamente: solo usan los métodos **async** de tres servicios. Para pasar a una API alcanza con reescribir el cuerpo de esos métodos manteniendo las mismas firmas.

| Servicio | Métodos | Endpoint sugerido |
|---|---|---|
| `authService` | `login`, `register`, `requestPasswordReset`, `verifyResetCode`, `resetPassword`, `getRememberedEmail` | `POST /auth/login`, `POST /auth/register`, `POST /auth/forgot`, `POST /auth/verify-code`, `POST /auth/reset` |
| `productService` | `list`, `create`, `update`, `remove` | `GET/POST /products`, `PUT/DELETE /products/:id` |
| `profileService` | `update` | `PUT /users/:id` |

Ejemplo para `productService.list`:

```ts
const API_URL = process.env.EXPO_PUBLIC_API_URL;

async list(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new ServiceError('http_error', 'No pudimos cargar los productos.');
  return (await res.json()) as Product[];
}
```

Pasos:

1. Definir `EXPO_PUBLIC_API_URL` en `.env`.
2. **Errores:** cuando la API responda con un error, lanzar `ServiceError(code, mensaje)`. Las pantallas ya muestran `mensaje` en un banner (por ejemplo, credenciales inválidas o correo ya registrado).
3. **Sesión:** hacer que `login` devuelva también el token, guardarlo en `AuthContext` y persistirlo con `expo-secure-store` para que la sesión sobreviva al cerrar la app. Al iniciar, leerlo y, si es válido, entrar directo a las pestañas.
4. **Imágenes:** antes de `create`/`update` (o de `profileService.update`), subir el archivo con `FormData` (multipart) y guardar en `imageUri`/`photoUri` la URL que devuelva el servidor. Las validaciones de formato y tamaño (`src/utils/imagePicker.ts`) siguen sirviendo del lado del cliente.
5. Borrar `src/services/db.ts` y `DEMO_RESET_CODE` cuando ya no se usen.

El estado de la app (`AuthContext`, `ProductsContext`) no cambia: sigue llamando a los mismos métodos.

## Estructura

```text
├── App.tsx                 fuentes Figtree, providers y navegación
├── assets/                 icon.png (logo ALUMAT), edificio.png (foto del login)
└── src/
    ├── theme/tokens.ts     colores, tipografía, espaciado, radios y medidas
    ├── components/         Hero, Wave, Panes, TextField, PasswordField, Button, OtpInput,
    │                       SelectField, ImagePickerField, ConfirmSheet, TabBar, Logo, Banner…
    ├── navigation/         RootNavigator, AuthStack, AppTabs, ProductosStack, PerfilStack
    ├── screens/auth/       Login, Registro, Olvide, Codigo, Nueva, Listo
    ├── screens/            Inicio, Productos, ProductoForm, Perfil, EditarPerfil
    ├── context/            AuthContext, ProductsContext (Context + useReducer)
    ├── hooks/useForm.ts    validación al salir del campo y al enviar, foco al primer error
    ├── services/           authService, productService, profileService, db (en memoria)
    └── utils/              validators, format (precios es-AR, fechas), imagePicker
```
