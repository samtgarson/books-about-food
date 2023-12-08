export function transformKeys<T extends Record<string, unknown>>(
  obj: Record<string, unknown>,
  fn: (key: string) => string
): T {
  if (!obj) return obj as T
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      fn(key),
      Array.isArray(value)
        ? value.map((v) => transformKeys(v, fn))
        : typeof value === 'object' &&
          value !== null &&
          !(value instanceof Date)
        ? transformKeys(value as Record<string, unknown>, fn)
        : value
    ])
  ) as T
}
