export const random20DigitNumber = () => {
  return Math.floor(Math.random() * 9e19 + 1e19).toString();
};

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
