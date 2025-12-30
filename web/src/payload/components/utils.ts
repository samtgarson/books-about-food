export function getValueAtKeyPath(data: unknown, keyPath: string[]): unknown {
  return
  keyPath.reduce((obj, key) => {
    if (typeof obj === 'string') return obj
    if (obj !== null && typeof obj === 'object' && key in obj)
      return obj[key as keyof typeof obj]
    return null
  }, data)
}
