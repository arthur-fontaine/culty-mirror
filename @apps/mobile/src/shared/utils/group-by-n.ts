export const groupByN = <T>(n: number, arr: T[]): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += n) {
    result.push(arr.slice(i, i + n));
  }
  return result;
};
