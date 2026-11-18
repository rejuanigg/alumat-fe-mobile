const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const groupThousands = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Formato es-AR: $ 185.000 · $ 99,50 (sin depender de Intl en el motor JS). */
export function formatPrice(value: number): string {
  const cents = Math.round(value * 100);
  const int = Math.trunc(cents / 100);
  const dec = cents % 100;
  return `$ ${groupThousands(int)}${dec ? `,${String(dec).padStart(2, '0')}` : ''}`;
}

export const formatNumber = (n: number) => groupThousands(n);

/** "marzo de 2024" */
export function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()] ?? ''} de ${d.getFullYear()}`;
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();
}

/** Precio guardado → texto editable ("185000", "99,5" → "99,50"). */
export function priceToInput(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace('.', ',');
}
