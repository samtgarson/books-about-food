'use client'

import { Root } from '@radix-ui/react-form'
import { ComponentProps, ReactNode, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { FormContext } from './context'
import z from 'zod'

export type FormAction<S = Record<string, unknown>> = (
  values: S
) => Promise<void>
export interface FormProps<T extends z.ZodTypeAny | undefined = undefined>
  extends Omit<ComponentProps<typeof Root>, 'action'> {
  action?: T extends z.ZodTypeAny ? FormAction<z.infer<T>> : FormAction
  naked?: boolean
  successMessage?: ReactNode
  schema?: T
}

export function Form<T extends z.ZodTypeAny | undefined = undefined>({
  className,
  action,
  naked = false,
  successMessage,
  children,
  schema,
  ...props
}: FormProps<T>) {
  const [state, setState] = useState({})
  const [errors, setErrors] = useState<z.ZodError>()
  const formRef = useRef<HTMLFormElement>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handler = (event: Event) => {
      if (!(event.target instanceof HTMLInputElement)) return
      if (event.target.type === 'hidden') return
      const form = event.target.form
      if (!form || form !== formRef.current) return

      const formData = Object.fromEntries(new FormData(form).entries())
      setState(formData)
    }

    document.addEventListener('change', handler)
    return () => document.removeEventListener('change', handler)
  }, [])

  return (
    <FormContext.Provider value={{ state, errors }}>
      <Root
        {...props}
        ref={formRef}
        action={
          typeof action === 'string'
            ? action
            : async (data) => {
                if (!action) return
                const values = Object.fromEntries(data.entries())
                if (schema) {
                  const parsed = schema.safeParse(values)
                  if (parsed.success) await action(parsed.data)
                  else setErrors(parsed.error)
                } else {
                  await action(values)
                }
                setSuccess(true)
              }
        }
        className={cn(
          !naked && 'flex flex-col w-full max-w-xl gap-4',
          className
        )}
      >
        {success && successMessage ? successMessage : children}
      </Root>
    </FormContext.Provider>
  )
}
