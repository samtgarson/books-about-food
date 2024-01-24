export const sample = <T>(arr: T[]) => arr[randomBelow(arr.length)]

export const randomBelow = (max: number) => Math.floor(Math.random() * max)

export function toggleItem<T>(arr: T[], item: T, included: boolean) {
  return included ? arr.filter((i) => i !== item) : [...arr, item]
}
