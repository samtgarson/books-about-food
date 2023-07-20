import { z } from 'zod'

export const numeric = z.preprocess(
  (val) => parseInt(val as string, 10),
  z.number()
)

export const array = <T extends z.ZodTypeAny>(type: T) => {
  return z.preprocess((val) => {
    if (Array.isArray(val)) return val
    return `${val}`.split(',')
  }, z.array(type))
}

export const dbEnum = <T extends string>(obj: Record<string, T>) =>
  z.enum(Object.values(obj) as [T, ...T[]])
