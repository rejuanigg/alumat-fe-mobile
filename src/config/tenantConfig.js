import { COLORS as BASE_COLORS } from '../theme/colors';

// ---------------------------------------------------------------------------
// Configuración por empresa (tenant). Por ahora hay una sola, la por defecto.
// La lógica de validación, el manejo de errores, la accesibilidad y las
// medidas de seguridad son comunes; acá solo va lo que cada organización puede
// personalizar.
//
// Ojo: cambiar el logo, los colores o los textos NO separa a las empresas de
// forma segura. En una arquitectura multi-tenant es el backend quien debe
// validar que cada usuario acceda solo a los recursos de las organizaciones
// para las que tiene autorización.
// ---------------------------------------------------------------------------
export const TENANT = {
  id: 'default',
  name: 'Alcopy',

  logo: require('../assets/icon.png'),

  // Paleta de las pantallas de acceso. Parte de la paleta base de la app y
  // oscurece los tonos que no llegaban a 4.5:1 sobre el fondo beige (#E7E7D8).
  // Si una empresa cambia colores, tiene que respetar ese mínimo.
  colors: {
    ...BASE_COLORS,
    text: '#55636F', // antes #6B7A8A (3.5:1) → 4.95:1
    error: '#B71C1C', // antes #E53935 (3.4:1) → 5.26:1
    link: '#06689A', // enlaces; el primario #0873A8 da 4.2:1 → 4.87:1
  },

  // Placeholder del correo: un EJEMPLO de formato, nunca la etiqueta repetida.
  // Uso corporativo → 'usuario@empresa.com'; público general → 'ejemplo@correo.com'
  emailPlaceholder: 'usuario@empresa.com',

  // Mostrar "¿No tiene cuenta? Regístrese". Desactivar en empresas donde las
  // cuentas las crean solo los administradores.
  allowSelfRegistration: true,

  // Mostrar la casilla "Recordar" (guarda solo el correo, nunca la contraseña).
  // En dispositivos compartidos puede convenir desactivarla.
  allowRememberEmail: true,

  // Tiempo máximo de espera del servicio de autenticación: el formulario no
  // debe quedar bloqueado indefinidamente ante conexiones lentas.
  authTimeoutMs: 15000,

  // Reemplazos del catálogo de textos (src/constants/messages.js), por sección.
  // Ejemplo: { login: { subtitle: 'Acceda a su cuenta con sus credenciales' } }
  messages: {},
};
