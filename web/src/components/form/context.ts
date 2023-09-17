import { createContext, useContext } from 'react'
import { ZodError } from 'zod'

export type FormContext = {
  state: Record<string, unknown>
  errors?: ZodError
}
export const FormContext = createContext({} as FormContext)
export const useForm = () => useContext(FormContext)
export const useFormField = (name: string) =>
  useContext(FormContext).state[name] as string | undefined
