// Precio en pesos con formato local: 90000.5 → "$ 90.000,50".
// Se arma a mano para no depender del soporte de Intl en cada plataforma.
export function formatPrice(value) {
  const number = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  const [integer, decimals] = number.toFixed(2).split('.');
  const withThousands = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$ ${withThousands},${decimals}`;
}
