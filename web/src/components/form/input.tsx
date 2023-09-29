'use client'

import * as Form from '@radix-ui/react-form'
import cn from 'classnames'
import { useFormField } from './context'
import { Label } from './label'
import { Messages } from './messages'

export type InputProps = {
  label: string
  name: string
} & React.ComponentProps<'input'>

export function Input({ label, name, ...props }: InputProps) {
  const { error } = useFormField(name)

  return (
    <Form.Field
      name={name}
      className="flex flex-col gap-2"
      serverInvalid={!!error}
    >
      <Label required={props.required}>{label}</Label>
      <Form.Control asChild>
        <input
          name={name}
          {...props}
          className={cn(
            'bg-white bg-opacity-60 p-4 transition-colors placeholder:text-black/20 focus:bg-opacity-100 focus:outline-none',
            props.disabled && 'text-neutral-grey'
          )}
        />
      </Form.Control>
      <Messages label={label} name={name} {...props} />
    </Form.Field>
  )
}
