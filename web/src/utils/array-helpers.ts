export const sample = <T>(arr: T[]) => arr[randomBelow(arr.length)]

export const randomBelow = (max: number) => Math.floor(Math.random() * max)

export const toggleItem = <T>(arr: T[], item: T, included: boolean) =>
  included ? arr.filter((i) => i !== item) : [...arr, item]

export const shuffle = <T>(arr: T[]) => arr.sort(() => 0.5 - Math.random())
