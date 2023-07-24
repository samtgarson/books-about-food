import { z } from 'zod'

export const numeric = z.coerce.number()

export const paginationInput = z.object({
  page: numeric.optional(),
  perPage: numeric.optional()
})

export const array = <T extends z.ZodTypeAny>(
  type: T,
  { acceptSingle = false } = {}
) => {
  const schema = acceptSingle ? z.array(type).or(type) : z.array(type)
  return z.preprocess((val) => {
    if (Array.isArray(val)) return val
    return `${val}`.split(',')
  }, schema)
}

export const processArray = <T>(val: T | T[]): T[] =>
  Array.isArray(val) ? val : [val]

export const dbEnum = <T extends string>(obj: Record<string, T>) =>
  z.enum(Object.values(obj) as [T, ...T[]])
