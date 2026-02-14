export const getEnv = (key: string, value?: string): string => {
  if (value) return value
  if (key && process.env[key]) return process.env[key]
  throw new Error(`Missing env var: ${key}`)
}
