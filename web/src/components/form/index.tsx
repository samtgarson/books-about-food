'use client'

import { Root } from '@radix-ui/react-form'
import cn from 'classnames'
import { ComponentProps, ReactNode, useEffect, useRef, useState } from 'react'
import z from 'zod'
import { FormContext, FormErrors, FormStyleVariant } from './context'

export type FormAction<S = Record<string, unknown>> = (
  values: S
) => Promise<FormErrors | void>

export interface FormProps<T extends z.ZodTypeAny | undefined = undefined>
  extends Omit<ComponentProps<typeof Root>, 'action'> {
  action?: T extends z.ZodTypeAny ? FormAction<z.infer<T>> : FormAction
  naked?: boolean
  successMessage?: ReactNode
  schema?: T
  variant?: FormStyleVariant
}

export function Form<T extends z.ZodTypeAny | undefined = undefined>({
  className,
  action,
  naked = false,
  successMessage,
  children,
  schema,
  variant = 'default',
  ...props
}: FormProps<T>) {
  const [state, setState] = useState({})
  const [errors, setErrors] = useState<FormErrors>()
  const formRef = useRef<HTMLFormElement>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const changeHandler = (event: Event) => {
      if (!(event.target instanceof HTMLInputElement)) return
      if (event.target.type === 'hidden') return
      const form = event.target.form
      if (!form || form !== formRef.current) return

      const formData = Object.fromEntries(new FormData(form).entries())
      setState(formData)
      setErrors(undefined)
    }

    const keyHandler = (e: KeyboardEvent) => {
      if (!formRef.current || !(e.target instanceof HTMLElement)) return
      if (!formRef.current.contains(e.target)) return

      if (e.key === 'Enter' && e.metaKey) formRef.current?.requestSubmit()
    }

    document.addEventListener('change', changeHandler)
    document.addEventListener('keydown', keyHandler)
    return () => {
      document.removeEventListener('change', changeHandler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [])

  return (
    <FormContext.Provider value={{ state, errors, variant }}>
      <Root
        {...props}
        ref={formRef}
        action={
          typeof action === 'string'
            ? action
            : async (data) => {
                if (!action) return
                let errors: FormErrors | void = undefined
                const values = Object.fromEntries(data.entries())
                if (schema) {
                  const parsed = schema.safeParse(values)
                  if (!parsed.success) setErrors(parseZodError(parsed.error))
                  else errors = await action(parsed.data)
                } else {
                  errors = await action(values)
                }
                if (errors) setErrors(errors)
                setSuccess(true)
              }
        }
        className={cn(
          !naked && 'flex w-full max-w-xl flex-col gap-4',
          className
        )}
        onClearServerErrors={() => setErrors(undefined)}
      >
        {success && successMessage ? successMessage : children}
      </Root>
    </FormContext.Provider>
  )
}

function parseZodError(e: z.ZodError): FormErrors {
  return e.issues.reduce((acc, curr) => {
    acc[curr.path[0]] = { message: curr.message }
    return acc
  }, {} as FormErrors)
}
