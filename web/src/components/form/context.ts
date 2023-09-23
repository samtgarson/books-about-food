import { createContext, useContext } from 'react'
import { ZodError } from 'zod'

export type FormStyleVariant = 'default' | 'bordered'

export type FormContext = {
  state: Record<string, unknown>
  errors?: ZodError
  variant: FormStyleVariant
}
export const FormContext = createContext({} as FormContext)
export const useForm = () => useContext(FormContext)
export const useFormField = (name: string) =>
  useContext(FormContext).state[name] as string | undefined
