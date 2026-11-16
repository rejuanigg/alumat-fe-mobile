import { TENANT } from '../config/tenantConfig';

// ---------------------------------------------------------------------------
// Catálogo centralizado de textos.
// Tratamiento formal ("usted") en toda la pantalla. Ninguna pantalla debe tener
// textos sueltos: si hay que cambiar un mensaje, se cambia acá (o en
// TENANT.messages para una empresa en particular).
// ---------------------------------------------------------------------------
const DEFAULT_MESSAGES = {
  login: {
    title: 'Iniciar sesión',
    subtitle: 'Ingrese su correo electrónico y contraseña para continuar',

    emailLabel: 'Correo electrónico',
    emailPlaceholder: TENANT.emailPlaceholder,

    passwordLabel: 'Contraseña',
    // El ocultamiento real lo hace secureTextEntry; esto es solo orientativo
    // (8 puntos = longitud mínima habitual).
    passwordPlaceholder: '••••••••',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',

    remember: 'Recordar',
    rememberHint: 'Guarda solo su correo electrónico en este dispositivo',

    submit: 'Iniciar sesión',
    submitting: 'Iniciando sesión…',

    forgotPassword: '¿Olvidó su contraseña?',

    // El documento sugiere "¿No tenés cuenta? Registrate" (voseo), pero se
    // prioriza la coherencia con el resto de los mensajes formales.
    noAccount: '¿No tiene cuenta?',
    register: 'Regístrese',

    retry: 'Reintentar',
  },

  forgotPassword: {
    // Mismo mensaje exista o no la cuenta: no confirma qué correos están registrados
    confirmation:
      'Si el correo corresponde a una cuenta, recibirá las instrucciones para restablecer su contraseña',
  },

  // Errores de validación local (se muestran debajo de cada campo)
  validation: {
    emailRequired: 'Ingrese su correo electrónico',
    emailInvalid: 'Ingrese un correo electrónico válido',
    passwordRequired: 'Ingrese su contraseña',
  },

  // Errores de autenticación (se muestran en la notificación general).
  // Nunca revelan si falló el correo o la contraseña (enumeración de usuarios).
  auth: {
    invalidCredentials: 'No pudimos iniciar sesión. Verifique su correo electrónico y contraseña',
    network: 'No pudimos conectarnos. Verifique su conexión a internet e inténtelo nuevamente',
    tooManyRequests: 'Se realizaron demasiados intentos. Espere unos minutos antes de volver a intentarlo',
    // También para errores internos, códigos desconocidos y Firebase sin configurar
    serviceUnavailable: 'El servicio no está disponible en este momento. Inténtelo nuevamente más tarde',
  },

  products: {
    title: 'Productos',
    subtitle: 'Cree, edite y gestione los productos de la empresa',
    add: 'Nuevo producto',
    edit: 'Editar',
    empty: 'Todavía no hay productos cargados',
    emptyHint: 'Toque "Nuevo producto" para crear el primero',

    inStock: 'En stock',
    outOfStock: 'Sin stock',
    units: 'u.',

    createTitle: 'Nuevo producto',
    editTitle: 'Editar producto',
    imagePlaceholder: 'Imagen del producto',

    nameLabel: 'Nombre del producto',
    namePlaceholder: 'Ej: Vidrio templado 6mm',
    categoryLabel: 'Categoría',
    categoryPlaceholder: 'Ej: Vidrio',
    descriptionLabel: 'Descripción (opcional)',
    descriptionPlaceholder: 'Descripción del producto…',
    priceLabel: 'Precio',
    pricePlaceholder: '$ 0,00',
    stockLabel: 'Stock (unidades)',
    stockPlaceholder: '0',

    save: 'Guardar cambios',
    create: 'Crear producto',
    saving: 'Guardando…',

    delete: 'Eliminar producto',
    deleteConfirm: '¿Eliminar este producto? Esta acción no se puede deshacer',
    deleteConfirmAction: 'Sí, eliminar',
    deleteCancel: 'Cancelar',
    deleting: 'Eliminando…',

    retry: 'Reintentar',
  },

  productValidation: {
    nameRequired: 'Ingrese el nombre del producto',
    categoryRequired: 'Ingrese la categoría',
    priceRequired: 'Ingrese el precio',
    priceInvalid: 'Ingrese un precio válido (ej: 90.000,50)',
    stockRequired: 'Ingrese el stock',
    stockInvalid: 'Ingrese un número entero mayor o igual a 0',
    tooLong: 'El texto es demasiado largo',
  },

  productErrors: {
    load: 'No pudimos cargar los productos. Verifique su conexión e inténtelo nuevamente',
    network: 'No pudimos confirmar la operación. Verifique su conexión a internet e inténtelo nuevamente',
    permissionDenied: 'No tiene permisos para realizar esta acción',
    notFound: 'El producto ya no existe. Puede que otra persona lo haya eliminado',
    serviceUnavailable: 'El servicio no está disponible en este momento. Inténtelo nuevamente más tarde',
  },
};

// Cada empresa puede reemplazar textos puntuales sin duplicar el catálogo
const mergeSections = (base, overrides = {}) =>
  Object.fromEntries(
    Object.entries(base).map(([section, texts]) => [
      section,
      { ...texts, ...(overrides[section] || {}) },
    ])
  );

export const MESSAGES = mergeSections(DEFAULT_MESSAGES, TENANT.messages);
