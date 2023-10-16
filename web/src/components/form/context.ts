import { createContext, useContext } from 'react'

export type FormStyleVariant = 'default' | 'bordered'
export type FormErrors = Record<string, FormError>
export type FormError = { message: string }

export type FormContext = {
  state: Record<string, unknown>
  errors?: FormErrors
  setErrors: (errors: FormErrors) => void
  variant: FormStyleVariant
}
export const FormContext = createContext({} as FormContext)
export const useForm = () => useContext(FormContext)
export const useFormField = (name: string) => {
  const form = useForm()
  return {
    value: form.state[name],
    error: form.errors?.[name],
    setError: (error: FormError) =>
      form.setErrors({ ...form.errors, [name]: error })
  }
}
