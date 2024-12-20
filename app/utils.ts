export const capitalizeWord = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

export const truncateByDecimalPlace = (
  value: number,
  numDecimalPlaces: number
) =>
  Math.trunc(value * Math.pow(10, numDecimalPlaces)) /
  Math.pow(10, numDecimalPlaces);
