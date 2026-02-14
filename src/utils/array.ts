export const wrapArray = <T>(val: T | T[]): T[] =>
  Array.isArray(val) ? val : [val]

export const shuffle = <T>(arr: T[]) => arr.sort(() => 0.5 - Math.random())
