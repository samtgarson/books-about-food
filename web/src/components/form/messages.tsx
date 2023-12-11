'use client'

import * as Form from '@radix-ui/react-form'
import cn from 'classnames'
import { InputHTMLAttributes } from 'react'
import { useFormField } from './context'

export type MessagesProps = {
  name: string
  label: string
} & Pick<InputHTMLAttributes<any>, 'minLength' | 'maxLength' | 'type'> // eslint-disable-line @typescript-eslint/no-explicit-any

export const FormMessage = ({ className, ...props }: Form.FormMessageProps) => {
  return (
    <Form.Message
      {...props}
      className={cn(className, 'text-14 mt-2 text-primary-red')}
    />
  )
}

export function Messages({ label, name, ...props }: MessagesProps) {
  const { error } = useFormField(name)
  return (
    <>
      <FormMessage match="valueMissing">{label} is required</FormMessage>
      <FormMessage match="tooShort">
        {label} must be at least {props.minLength} characters
      </FormMessage>
      <FormMessage match="tooLong">
        {label} must be at most {props.maxLength} characters
      </FormMessage>
      <FormMessage match="typeMismatch">
        {label} must be a valid {props.type}
      </FormMessage>
      {error && <FormMessage>{error.message}</FormMessage>}
    </>
  )
}
