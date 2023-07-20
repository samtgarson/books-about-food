'use client'

import * as Form from '@radix-ui/react-form'
import { Label } from './label'
import { Messages } from './messages'

export type InputProps = {
  label: string
  name: string
} & React.ComponentProps<'input'>

export function Input({ label, name, ...props }: InputProps) {
  return (
    <Form.Field name={name} className="flex flex-col gap-2">
      <Label required={props.required}>{label}</Label>
      <Form.Control asChild>
        <input
          name={name}
          {...props}
          className="bg-white transition-colors bg-opacity-60 focus:bg-opacity-100 focus:outline-none p-4"
        />
      </Form.Control>
      <Messages label={label} {...props} />
    </Form.Field>
  )
}
