import { z } from 'zod'

export const numeric = z.coerce.number()

export const paginationInput = z.object({
  page: numeric.optional(),
  perPage: numeric.optional()
})

const preprocessArray = (val: unknown) => {
  if (Array.isArray(val)) return val
  return `${val}`.split(',')
}

export const array = <T extends z.ZodTypeAny>(type: T) => {
  return z.preprocess(preprocessArray, z.array(type))
}

export const arrayOrSingle = <T extends z.ZodTypeAny>(type: T) => {
  return z.preprocess(preprocessArray, type.or(z.array(type)))
}

export const processArray = <T>(val: T | T[]): T[] =>
  Array.isArray(val) ? val : [val]

export const dbEnum = <T extends string>(obj: Record<string, T>) =>
  z.enum(Object.values(obj) as [T, ...T[]])
