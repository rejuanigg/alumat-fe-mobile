# ALUMAT — app móvil

App de **ALUMAT** (fábrica de aberturas) hecha con **Expo + TypeScript**. Incluye:

1. Autenticación: login, registro, pantalla "Listo" y recuperación de contraseña por correo.
2. Perfil y edición de perfil (con foto).
3. CRUD de **Productos** (listar, buscar, crear, editar, eliminar) con imagen.
4. Inicio con bienvenida, cifras del catálogo y accesos.

Los datos se guardan en **Firebase** (ver [Configurar Firebase](#configurar-firebase)).

## Requisitos

- Node.js 24.12 o posterior y npm (lo exige Firebase).
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

## Configurar Firebase

La app usa **Firebase Authentication** (cuentas y recuperación de contraseña) y **Cloud Firestore** (perfiles y productos). No necesita plan pago ni Firebase Storage.

1. **Credenciales:** copiar `.env.example` a `.env` y completar los seis valores `EXPO_PUBLIC_FIREBASE_*` con el `firebaseConfig` de la app web del proyecto (Firebase Console → Configuración del proyecto → Tus apps). Si falta alguno, la app no arranca y lo indica.
2. **Authentication:** en Authentication → Método de acceso, habilitar **Correo electrónico/contraseña**.
3. **Firestore:** crear la base de datos (si no existe) y publicar las reglas de `firestore.rules`: Firestore Database → Reglas → pegar el contenido → Publicar. Sin esas reglas, guardar perfiles o productos da "No tenés permiso".
4. **Correo de recuperación (opcional):** en Authentication → Plantillas → Restablecimiento de contraseña se puede cambiar el remitente y el texto. La app pide los correos en español.

Después de reiniciar Expo (`npx expo start -c`), registrá una cuenta desde la app. La primera vez que alguien entra se cargan los 5 productos de ejemplo.

## Cómo funciona cada parte

| Qué | Dónde | Cómo |
|---|---|---|
| Sesión | `authService`, `AuthContext` | `signInWithEmailAndPassword`. Con **Recordarme** la sesión se mantiene al cerrar la app (AsyncStorage en el teléfono, almacenamiento del navegador en web) y el correo queda precargado. Sin Recordarme, la sesión se cierra al volver a abrir la app. |
| Registro | `authService.register` | `createUserWithEmailAndPassword` + documento `users/{uid}` en Firestore. Se hace con una instancia secundaria de Firebase para no iniciar sesión sola: el flujo sigue siendo Registro → Listo → Login. Rol por defecto: `Vendedor` (se cambia desde la consola de Firestore). |
| Recuperar contraseña | `authService.requestPasswordReset` | `sendPasswordResetEmail`: llega un **correo real** con un enlace; la contraseña nueva se elige en la página de Firebase. Por seguridad, la app no informa si el correo tiene cuenta. |
| Perfil | `profileService`, `users/{uid}` | Nombre, apellido, teléfono y foto se guardan en Firestore. Cambiar el correo envía un enlace de verificación a la dirección nueva (`verifyBeforeUpdateEmail`); el cambio se aplica cuando la persona lo confirma. |
| Productos | `productService`, colección `products` | Catálogo compartido por todo el personal, sincronizado en tiempo real (`onSnapshot`). |
| Imágenes | `utils/imagePicker.ts` | Se valida el archivo original (PNG, JPG o WEBP, máx. 2 MB), se reduce y comprime a JPEG y se guarda como texto base64 dentro del documento de Firestore (máx. ~700 KB). |

Las reglas (`firestore.rules`) exigen sesión iniciada, permiten que cada persona lea y edite solo su perfil, y validan los campos de los productos con los mismos límites que la app.

Si más adelante se quiere usar otra API, las pantallas solo llaman a los métodos async de `authService`, `productService` y `profileService`: alcanza con reescribirlos manteniendo las firmas y lanzando `ServiceError(code, mensaje)` ante errores.

## Estructura

```text
├── App.tsx                 fuentes Figtree, providers y navegación
├── firestore.rules         reglas de seguridad de Firestore
├── assets/                 icon.png (logo ALUMAT), edificio.png (foto del login)
└── src/
    ├── theme/tokens.ts     colores, tipografía, espaciado, radios y medidas
    ├── components/         Hero, Wave, Panes, TextField, PasswordField, Button,
    │                       SelectField, ImagePickerField, ConfirmSheet, TabBar, Logo, Banner…
    ├── navigation/         RootNavigator, AuthStack, AppTabs, ProductosStack, PerfilStack
    ├── screens/auth/       Login, Registro, Olvide, Enviado, Listo
    ├── screens/            Inicio, Productos, ProductoForm, Perfil, EditarPerfil
    ├── context/            AuthContext, ProductsContext (Context + useReducer)
    ├── hooks/useForm.ts    validación al salir del campo y al enviar, foco al primer error
    ├── services/           firebase (config), authService, productService, profileService
    └── utils/              validators, format (precios es-AR, fechas), imagePicker
```
