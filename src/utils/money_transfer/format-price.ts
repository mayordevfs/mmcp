export function formatPrice(amount: number|undefined, currencySymbol: string = '$'): string {
  const parts = amount!.toFixed(2).split('.');
  const integer = parts[0];
  const fraction = parts[1];

  // Add comma separators to the integer part
  const withCommas = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `${currencySymbol}${withCommas}.${fraction}`;
}
