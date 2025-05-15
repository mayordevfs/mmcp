export const random20DigitNumber = () => {
  return Math.floor(Math.random() * 9e19 + 1e19).toString();
};