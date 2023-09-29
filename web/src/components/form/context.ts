import { createContext, useContext } from 'react'
import { AppErrorJSON, ErrorType } from 'src/services/utils/errors'

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
export const useFormField = (name: string) => {
  const form = useForm()
  return { value: form.state[name], error: form.errors?.[name] }
}

export function parseAppError(
  e: AppErrorJSON[],
  messages?: Record<string, { [key in ErrorType]?: string }>
) {
  return e.reduce<FormErrors>((errors, error) => {
    const field = error.field || '_'
    const message = messages?.[field]?.[error.type] || 'Something went wrong'
    return { ...errors, [field]: { message } }
  }, {})
}
