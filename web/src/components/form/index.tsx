'use client'

import { Root } from '@radix-ui/react-form'
import {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import cn from 'classnames'

export type FormAction = (values: Record<string, unknown>) => Promise<void>
export type FormProps = Omit<ComponentProps<typeof Root>, 'action'> & {
  action?: FormAction
}

type FormContext = {
  state: Record<string, unknown>
}
const FormContext = createContext({} as FormContext)
export const useForm = () => useContext(FormContext)

export function Form({ className, action, ...props }: FormProps) {
  const [state, setState] = useState({})
  const formRef = useRef<HTMLFormElement>(null)

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
    <FormContext.Provider value={{ state }}>
      <Root
        {...props}
        ref={formRef}
        action={async (data) => {
          if (!action) return
          const values = Object.fromEntries(data.entries())
          await action(values)
        }}
        className={cn('flex flex-col w-full max-w-xl gap-4', className)}
      />
    </FormContext.Provider>
  )
}
