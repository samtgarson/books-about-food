export const wrapArray = <T>(val: T | T[]): T[] =>
  Array.isArray(val) ? val : [val]
