import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

import { MESSAGES } from '../constants/messages';
import { TENANT } from '../config/tenantConfig';
import {
  VALIDATION_ERROR,
  validateEmail,
  validatePassword,
  validateLoginForm,
} from '../validation/loginValidation';
import { AUTH_ERROR, signIn } from '../services/authService';
import {
  getRememberedEmail,
  saveRememberedEmail,
  clearRememberedEmail,
} from '../services/rememberedEmail';

// ---------------------------------------------------------------------------
// Estado y comportamiento del formulario de inicio de sesión.
//
// Cuándo se muestran los errores:
// - Mientras escribe (onChange): no se señalan errores nuevos; solo se limpia
//   un error existente cuando ya quedó corregido. Después del primer intento
//   de envío, los mensajes se actualizan en vivo.
// - Al salir del campo (onBlur): se comprueba el formato del correo si escribió
//   algo. No se marca "obligatorio" solo por pasar por el campo.
// - Al enviar (onSubmit): se validan todos los campos antes de llamar al
//   servidor; si hay errores no se envía nada.
// ---------------------------------------------------------------------------

const FIELD_VALIDATORS = {
  email: validateEmail,
  password: validatePassword,
};

const FIELD_ERROR_MESSAGES = {
  email: {
    [VALIDATION_ERROR.REQUIRED]: MESSAGES.validation.emailRequired,
    [VALIDATION_ERROR.INVALID_FORMAT]: MESSAGES.validation.emailInvalid,
  },
  password: {
    [VALIDATION_ERROR.REQUIRED]: MESSAGES.validation.passwordRequired,
  },
};

const AUTH_ERROR_MESSAGES = {
  [AUTH_ERROR.INVALID_CREDENTIALS]: MESSAGES.auth.invalidCredentials,
  [AUTH_ERROR.NETWORK]: MESSAGES.auth.network,
  [AUTH_ERROR.TOO_MANY_REQUESTS]: MESSAGES.auth.tooManyRequests,
  [AUTH_ERROR.SERVICE_UNAVAILABLE]: MESSAGES.auth.serviceUnavailable,
  [AUTH_ERROR.NOT_CONFIGURED]: MESSAGES.auth.serviceUnavailable,
  [AUTH_ERROR.UNKNOWN]: MESSAGES.auth.serviceUnavailable,
};

// Errores en los que reintentar en el momento tiene sentido y es seguro
const RETRYABLE = [AUTH_ERROR.NETWORK];

// En Android los mensajes se anuncian por accessibilityLiveRegion; en iOS hay
// que pedirlo explícitamente a VoiceOver.
const announce = (text) => {
  if (text && Platform.OS === 'ios') {
    AccessibilityInfo.announceForAccessibility(text);
  }
};

const EMPTY_ERRORS = { email: null, password: null };

export default function useLoginForm() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  // Evita envíos duplicados aunque se toque dos veces antes del re-render
  const submittingRef = useRef(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Si había un correo recordado, se completa el campo
  useEffect(() => {
    if (!TENANT.allowRememberEmail) return;
    let active = true;
    getRememberedEmail().then((saved) => {
      if (!active || !saved) return;
      // No pisa lo que el usuario ya haya empezado a escribir
      setValues((prev) => (prev.email ? prev : { ...prev, email: saved }));
      setRemember(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const onChange = useCallback(
    (name) => (text) => {
      setValues((prev) => ({ ...prev, [name]: text }));
      setAuthError(null);
      setErrors((prev) => {
        const next = FIELD_VALIDATORS[name](text);
        if (submitAttempted) return { ...prev, [name]: next };
        return prev[name] && !next ? { ...prev, [name]: null } : prev;
      });
    },
    [submitAttempted]
  );

  const onBlur = useCallback(
    (name) => () => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const value = values[name];
      if (submitAttempted || (name === 'email' && value.trim())) {
        setErrors((prev) => ({ ...prev, [name]: FIELD_VALIDATORS[name](value) }));
      }
    },
    [values, submitAttempted]
  );

  // Desactivar "Recordar" borra el dato guardado en el momento
  const onToggleRemember = useCallback((next) => {
    setRemember(next);
    if (!next) clearRememberedEmail();
  }, []);

  const onSubmit = useCallback(async () => {
    if (submittingRef.current) return;

    setSubmitAttempted(true);
    setAuthError(null);

    const result = validateLoginForm(values);
    setErrors(result.errors);

    if (!result.isValid) {
      // Foco en el primer campo con error y anuncio para lectores de pantalla
      (result.errors.email ? emailRef : passwordRef).current?.focus();
      announce(
        ['email', 'password']
          .map((name) => FIELD_ERROR_MESSAGES[name][result.errors[name]])
          .filter(Boolean)
          .join('. ')
      );
      return;
    }

    // El campo muestra el correo tal como se envía (sin espacios exteriores)
    setValues((prev) => ({ ...prev, email: result.values.email }));

    submittingRef.current = true;
    setLoading(true);

    try {
      const response = await signIn(result.values.email, result.values.password);

      if (response.ok) {
        if (TENANT.allowRememberEmail && remember) {
          await saveRememberedEmail(result.values.email);
        } else {
          await clearRememberedEmail();
        }
        return;
      }

      setAuthError(response.category);
      announce(AUTH_ERROR_MESSAGES[response.category]);
    } finally {
      // Pase lo que pase, el formulario no queda bloqueado
      submittingRef.current = false;
      setLoading(false);
    }
  }, [values, remember]);

  return {
    values,
    touched,
    loading,
    remember,
    emailRef,
    passwordRef,

    // Textos listos para mostrar (null si no hay error)
    errors: {
      email: FIELD_ERROR_MESSAGES.email[errors.email] || null,
      password: FIELD_ERROR_MESSAGES.password[errors.password] || null,
    },
    authError: authError
      ? {
          message: AUTH_ERROR_MESSAGES[authError],
          canRetry: RETRYABLE.includes(authError),
        }
      : null,

    onChangeEmail: onChange('email'),
    onChangePassword: onChange('password'),
    onBlurEmail: onBlur('email'),
    onBlurPassword: onBlur('password'),
    onToggleRemember,
    onSubmit,
  };
}
