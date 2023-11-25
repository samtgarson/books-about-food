import { z } from 'zod'

export const numeric = z.coerce.number()

export const paginationInput = z.object({
  page: numeric.optional(),
  perPage: numeric.optional()
})

const preprocessArray = (val: unknown) => {
  const arr = Array.isArray(val) ? val : `${val}`.split(',')
  return arr.filter((v) => typeof v !== 'string' || !!v?.length)
}

export const array = <T extends z.ZodTypeAny>(type: T) => {
  return z.preprocess(preprocessArray, z.array(type))
}

export const arrayOrSingle = <T extends z.ZodTypeAny>(type: T) => {
  return z.preprocess(preprocessArray, type.or(z.array(type)))
}

export const dbEnum = <T extends string>(obj: Record<string, T>) =>
  z.enum(Object.values(obj) as [T, ...T[]])

export const processString = <T extends z.ZodTypeAny>(type: T) =>
  z.preprocess((val) => {
    if (typeof val === 'string' && val.length === 0) return undefined
    return val
  }, type)
