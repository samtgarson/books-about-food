export const sample = <T>(arr: T[]) => arr[randomBelow(arr.length)]

export const randomBelow = (max: number) => Math.floor(Math.random() * max)

export const toggleItemAuto = <T>(arr: T[], item: T) =>
  toggleItem(arr, item, arr.includes(item))

export const toggleItem = <T>(arr: T[], item: T, included: boolean) =>
  included ? arr.filter((i) => i !== item) : [...arr, item]

export const shuffle = <T>(arr: T[]) => arr.sort(() => 0.5 - Math.random())

export const range = (n: number) => Array.from({ length: n }, (_, i) => i)
