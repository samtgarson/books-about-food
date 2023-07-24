'use client'

import * as Form from '@radix-ui/react-form'
import { ComponentProps } from 'react'
import cn from 'classnames'

export type MessagesProps = {
  label: string
} & React.InputHTMLAttributes<any> // eslint-disable-line @typescript-eslint/no-explicit-any

export const FormMessage = ({
  className,
  ...props
}: ComponentProps<typeof Form.Message>) => {
  return <Form.Message {...props} className={cn(className, 'text-14 mt-2')} />
}

export function Messages({ label, ...props }: MessagesProps) {
  return (
    <>
      <FormMessage match="valueMissing">{label} is required</FormMessage>
      <FormMessage match="tooShort">
        {label} must be at least {props.minLength} characters
      </FormMessage>
      <FormMessage match="tooLong">
        {label} must be at most {props.maxLength} characters
      </FormMessage>
    </>
  )
}
