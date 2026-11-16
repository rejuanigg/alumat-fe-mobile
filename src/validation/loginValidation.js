// ---------------------------------------------------------------------------
// Reglas de validación del inicio de sesión.
// Funciones PURAS: sin React ni Firebase, para poder testearlas de forma
// aislada. Devuelven códigos de error (no textos); los textos están en
// src/constants/messages.js.
//
// Estas comprobaciones solo evitan solicitudes evidentemente incorrectas:
// NO reemplazan la validación que hace el servicio de autenticación.
// ---------------------------------------------------------------------------

export const VALIDATION_ERROR = {
  REQUIRED: 'required',
  INVALID_FORMAT: 'invalid-format',
};

// Regex del documento de especificación: parte local, @, dominio y una
// extensión de al menos 2 letras. Tiene limitaciones conocidas (por ejemplo,
// direcciones internacionales); el servidor vuelve a validar.
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Largo máximo de una dirección de correo (RFC 5321), compatible con Firebase.
// A la contraseña NO se le pone límite en el login: ya fue aceptada antes.
export const EMAIL_MAX_LENGTH = 254;

// Solo quita espacios accidentales al comienzo y al final
export const normalizeEmail = (value) =>
  typeof value === 'string' ? value.trim() : '';

export function validateEmail(value) {
  const email = normalizeEmail(value);

  if (!email) return VALIDATION_ERROR.REQUIRED;
  if (email.length > EMAIL_MAX_LENGTH || !EMAIL_REGEX.test(email)) {
    return VALIDATION_ERROR.INVALID_FORMAT;
  }
  return null;
}

// Solo se comprueba que exista. La contraseña nunca se modifica: ni trim, ni
// mayúsculas/minúsculas, ni reemplazo de caracteres ("   " es una contraseña).
export function validatePassword(value) {
  return typeof value === 'string' && value.length > 0
    ? null
    : VALIDATION_ERROR.REQUIRED;
}

// Validación completa al enviar. `values` trae los datos listos para enviar:
// correo normalizado y contraseña exactamente como se escribió.
export function validateLoginForm({ email, password }) {
  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  return {
    errors,
    isValid: !errors.email && !errors.password,
    values: {
      email: normalizeEmail(email),
      password: typeof password === 'string' ? password : '',
    },
  };
}
