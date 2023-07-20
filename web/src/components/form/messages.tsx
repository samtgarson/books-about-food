'use client'

import * as Form from '@radix-ui/react-form'

export type MessagesProps = {
  label: string
} & React.InputHTMLAttributes<any> // eslint-disable-line @typescript-eslint/no-explicit-any

export function Messages({ label, ...props }: MessagesProps) {
  return (
    <>
      <Form.Message match="valueMissing">{label} is required</Form.Message>
      <Form.Message match="tooShort">
        {label} must be at least {props.minLength} characters
      </Form.Message>
      <Form.Message match="tooLong">
        {label} must be at most {props.maxLength} characters
      </Form.Message>
    </>
  )
}
