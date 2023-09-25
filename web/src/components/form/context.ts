import { createContext, useContext } from 'react'

export type FormStyleVariant = 'default' | 'bordered'
export type FormErrors = Record<string, FormError>
export type FormError = { message: string }

export type FormContext = {
  state: Record<string, unknown>
  errors?: FormErrors
  variant: FormStyleVariant
}
export const FormContext = createContext({} as FormContext)
export const useForm = () => useContext(FormContext)
export const useFormField = (name: string) =>
  useContext(FormContext).state[name] as string | undefined
