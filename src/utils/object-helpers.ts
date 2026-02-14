export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const ret: Partial<T> = {}
  keys.forEach((key) => {
    ret[key] = obj[key]
  })
  return ret as Pick<T, K>
}

export function withoutUndefined<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (!value) return acc
    return { ...acc, [key]: value }
  }, {} as Partial<T>)
}
