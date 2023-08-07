export const sample = <T>(arr: T[]) => arr[randomBelow(arr.length)]

export const randomBelow = (max: number) => Math.floor(Math.random() * max)
