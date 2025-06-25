export const random20DigitNumber = () => {
  return Math.floor(Math.random() * 9e19 + 1e19).toString();
};

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export const randomNDigitNumber = (digits = 20) => {
  if (digits < 1) {
    throw new Error('Number of digits must be at least 1');
  }
  
  if (digits > 15) {
    // For large numbers, use string manipulation to avoid precision issues
    let result = '';
    for (let i = 0; i < digits; i++) {
      if (i === 0) {
        // First digit should be 1-9 to ensure we get the exact number of digits
        result += Math.floor(Math.random() * 9) + 1;
      } else {
        result += Math.floor(Math.random() * 10);
      }
    }
    return result;
  }
  
  // For smaller numbers, use the mathematical approach
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};
