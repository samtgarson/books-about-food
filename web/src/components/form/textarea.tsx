'use client'

import cn from 'classnames'
import { Form } from 'radix-ui'
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
            variant === 'bordered' && 'border border-neutral-grey'
          )}
        />
      </Form.Control>
      <Messages label={label} name={name} {...props} />
    </Form.Field>
  )
}
