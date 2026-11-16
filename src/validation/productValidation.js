// ---------------------------------------------------------------------------
// Reglas de validación de productos.
// Funciones PURAS: sin React ni Firebase, para poder testearlas de forma
// aislada. Devuelven códigos de error (no textos); los textos están en
// src/constants/messages.js (sección `products`).
// ---------------------------------------------------------------------------

export const PRODUCT_VALIDATION_ERROR = {
  REQUIRED: 'required',
  INVALID_NUMBER: 'invalid-number',
  TOO_LONG: 'too-long',
};

export const PRODUCT_LIMITS = {
  name: 80,
  category: 40,
  description: 500,
};

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

// Acepta el formato local: "90000", "90.000", "90000,50" o "$ 90.000,50".
// Devuelve NaN si no es un número válido.
export function parsePrice(value) {
  let text = clean(String(value ?? '')).replace(/[$\s]/g, '');
  if (!text) return NaN;

  if (text.includes(',')) {
    // La coma es el separador decimal: los puntos son de miles
    text = text.replace(/\./g, '').replace(',', '.');
  } else if (/^\d{1,3}(\.\d{3})+$/.test(text)) {
    // "90.000" → miles, no decimales
    text = text.replace(/\./g, '');
  }

  return /^\d+(\.\d+)?$/.test(text) ? Number(text) : NaN;
}

// Stock: entero mayor o igual a 0. Devuelve NaN si no es válido.
export function parseStock(value) {
  const text = clean(String(value ?? ''));
  return /^\d+$/.test(text) ? Number(text) : NaN;
}

const requiredText = (max) => (value) => {
  const text = clean(value);
  if (!text) return PRODUCT_VALIDATION_ERROR.REQUIRED;
  if (text.length > max) return PRODUCT_VALIDATION_ERROR.TOO_LONG;
  return null;
};

export const validateName = requiredText(PRODUCT_LIMITS.name);
export const validateCategory = requiredText(PRODUCT_LIMITS.category);

// La descripción es opcional
export function validateDescription(value) {
  return clean(value).length > PRODUCT_LIMITS.description
    ? PRODUCT_VALIDATION_ERROR.TOO_LONG
    : null;
}

export function validatePrice(value) {
  if (!clean(String(value ?? ''))) return PRODUCT_VALIDATION_ERROR.REQUIRED;
  return Number.isNaN(parsePrice(value)) ? PRODUCT_VALIDATION_ERROR.INVALID_NUMBER : null;
}

export function validateStock(value) {
  if (!clean(String(value ?? ''))) return PRODUCT_VALIDATION_ERROR.REQUIRED;
  return Number.isNaN(parseStock(value)) ? PRODUCT_VALIDATION_ERROR.INVALID_NUMBER : null;
}

export const PRODUCT_FIELD_VALIDATORS = {
  name: validateName,
  category: validateCategory,
  description: validateDescription,
  price: validatePrice,
  stock: validateStock,
};

// Validación completa al guardar. `values` sale listo para Firestore.
export function validateProductForm(form) {
  const errors = Object.fromEntries(
    Object.entries(PRODUCT_FIELD_VALIDATORS).map(([field, validate]) => [
      field,
      validate(form[field]),
    ])
  );

  return {
    errors,
    isValid: Object.values(errors).every((error) => !error),
    values: {
      name: clean(form.name),
      category: clean(form.category),
      description: clean(form.description),
      price: parsePrice(form.price),
      stock: parseStock(form.stock),
    },
  };
}
