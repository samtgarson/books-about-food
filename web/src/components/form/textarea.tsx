'use client'

import * as Form from '@radix-ui/react-form'
import cn from 'classnames'
import { useForm } from './context'
import { InputProps, useRequired } from './input-props'
import { Label } from './label'
import { Messages } from './messages'

export function TextArea({ label, name, ...props }: InputProps<'textarea'>) {
  const { variant } = useForm()
  const required = useRequired(props.required)

  return (
    <Form.Field name={name} className="flex flex-col gap-2">
      <Label required={required}>{label}</Label>
      <Form.Control asChild>
        <textarea
          name={name}
          {...props}
          required={required}
          className={cn(
            'bg-white bg-opacity-60 p-4 transition-colors placeholder:text-black/20 focus:bg-opacity-100 focus:outline-none',
            variant === 'bordered' && 'border-neutral-grey border'
          )}
        />
      </Form.Control>
      <Messages label={label} name={name} {...props} />
    </Form.Field>
  )
}
