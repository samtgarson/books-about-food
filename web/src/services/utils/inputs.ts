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
