/**
 * Validaciones escritas a mano. Cada validador devuelve el mensaje de error
 * o `undefined` si el valor es válido.
 */
export type Validator<V = string> = (value: V) => string | undefined;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
const PHONE_CHARS_REGEX = /^[\d\s+()-]+$/;
const PRICE_REGEX = /^\d+([.,]\d{1,2})?$/;
const INTEGER_REGEX = /^\d+$/;
const CODE_REGEX = /^\d{6}$/;

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'] as const;
const ALLOWED_IMAGE_MIME = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

// ── Autenticación / perfil ───────────────────────────────────────────

export const validateEmail: Validator = (raw) => {
  const v = raw.trim();
  if (!v) return 'Ingresá tu correo electrónico.';
  if (!EMAIL_REGEX.test(v)) return 'Ingresá un correo válido. Ej: nombre@empresa.com';
  return undefined;
};

export const validateLoginPassword: Validator = (v) =>
  v.length === 0 ? 'Ingresá tu contraseña.' : undefined;

const nameValidator =
  (emptyMessage: string): Validator =>
  (raw) => {
    const v = raw.trim();
    if (!v) return emptyMessage;
    if (v.length < 2) return 'Escribí al menos 2 letras.';
    if (!NAME_REGEX.test(v)) return 'Usá solo letras.';
    if (v.length > 40) return 'Máximo 40 caracteres.';
    return undefined;
  };

export const validateFirstName = nameValidator('Ingresá tu nombre.');
export const validateLastName = nameValidator('Ingresá tu apellido.');

export const validatePhone: Validator = (raw) => {
  const v = raw.trim();
  if (!v) return 'Ingresá tu teléfono.';
  if (!PHONE_CHARS_REGEX.test(v)) return 'Usá solo números, espacios, + y guiones.';
  const digits = v.replace(/\D/g, '').length;
  if (digits < 8 || digits > 15) return 'El teléfono debe tener entre 8 y 15 dígitos.';
  return undefined;
};

export type PasswordRules = { length: boolean; upper: boolean; number: boolean };

export function passwordRules(v: string): PasswordRules {
  return { length: v.length >= 8, upper: /[A-ZÁÉÍÓÚÑ]/.test(v), number: /\d/.test(v) };
}

export const validateNewPassword: Validator = (v) => {
  if (!v) return 'Ingresá una contraseña.';
  const r = passwordRules(v);
  if (!r.length) return 'Usá al menos 8 caracteres.';
  if (!r.upper) return 'Incluí al menos una mayúscula.';
  if (!r.number) return 'Incluí al menos un número.';
  return undefined;
};

export function validatePasswordMatch(password: string, repeat: string): string | undefined {
  if (!repeat) return 'Repetí la contraseña.';
  return password === repeat ? undefined : 'Las contraseñas no coinciden.';
}

export const validateTerms: Validator<boolean> = (accepted) =>
  accepted ? undefined : 'Aceptá los términos para continuar.';

export const validateCode: Validator = (v) =>
  CODE_REGEX.test(v) ? undefined : 'Ingresá los 6 dígitos del código.';

// ── Producto ─────────────────────────────────────────────────────────

export const validateProductName: Validator = (raw) => {
  const v = raw.trim();
  if (!v) return 'Ingresá el nombre del producto.';
  if (v.length < 3) return 'Escribí al menos 3 caracteres.';
  if (v.length > 60) return 'Máximo 60 caracteres.';
  return undefined;
};

export const validateCategory: Validator = (v) => (v ? undefined : 'Elegí una categoría.');

export function parsePrice(v: string): number {
  return Number(v.trim().replace(',', '.'));
}

export const validatePrice: Validator = (raw) => {
  const v = raw.trim();
  if (!v) return 'Ingresá el precio.';
  if (!PRICE_REGEX.test(v)) return 'Usá solo números. Ej: 125000 o 99,50.';
  if (parsePrice(v) <= 0) return 'El precio debe ser mayor a 0.';
  return undefined;
};

export const validateStock: Validator = (raw) => {
  const v = raw.trim();
  if (!v) return 'Ingresá el stock.';
  if (!INTEGER_REGEX.test(v)) return 'Ingresá un número entero.';
  if (Number(v) > 99999) return 'Máximo 99.999 unidades.';
  return undefined;
};

export const validateDescription: Validator = (v) =>
  v.length > 200 ? 'Máximo 200 caracteres.' : undefined;

export const validateProductImage: Validator<string | null> = (uri) =>
  uri ? undefined : 'Subí una imagen del producto.';

// ── Imágenes ─────────────────────────────────────────────────────────

export type ImageMeta = { uri: string; fileName?: string | null; mimeType?: string | null; fileSize?: number };

export function validateImageFormat(meta: ImageMeta): string | undefined {
  if (meta.mimeType) {
    return ALLOWED_IMAGE_MIME.includes(meta.mimeType.toLowerCase())
      ? undefined
      : 'Formato no válido. Usá PNG, JPG o WEBP.';
  }
  const source = (meta.fileName ?? meta.uri).split('?')[0] ?? '';
  const ext = source.split('.').pop()?.toLowerCase() ?? '';
  return (ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(ext)
    ? undefined
    : 'Formato no válido. Usá PNG, JPG o WEBP.';
}

export function validateImageSize(bytes: number, kind: 'product' | 'profile'): string | undefined {
  if (bytes <= MAX_IMAGE_BYTES) return undefined;
  return kind === 'product'
    ? 'La imagen supera los 2 MB. Elegí una más liviana.'
    : 'La foto supera los 2 MB. Elegí una más liviana.';
}
