import { ComponentProps, JSX } from 'react'
import { useForm } from '.'

export type Required = boolean | { ifNot: string | string[] }
export type InputProps<T extends keyof JSX.IntrinsicElements> = {
  label: string
  name: string
  required?: Required
} & Omit<ComponentProps<T>, 'name' | 'required'>

export const useRequired = (required?: Required): boolean | undefined => {
  const { state } = useForm()

  if (typeof required === 'boolean' || typeof required === 'undefined') {
    return required
  }

  if (Array.isArray(required.ifNot)) {
    return required.ifNot.some((name) => state[name]) ? false : true
  }

  return state[required.ifNot] ? false : true
}
