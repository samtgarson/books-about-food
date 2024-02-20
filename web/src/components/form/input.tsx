'use client'

import * as Form from '@radix-ui/react-form'
import cn from 'classnames'
import { forwardRef } from 'react'
import { FormStyleVariant, useForm, useFormField } from './context'
import { Label } from './label'
import { Messages } from './messages'

export type InputProps = {
  label?: string
  name: string
} & React.ComponentProps<'input'>

export const inputClasses = (
  variant: FormStyleVariant,
  props: React.ComponentProps<'input'>
) =>
  cn(
    'bg-white bg-opacity-60 p-4 transition-colors placeholder:text-black/20 focus-within:bg-opacity-100 focus-within:outline-none rounded-none',
    props.disabled && 'text-neutral-grey',
    variant === 'bordered' && 'border-neutral-grey border'
  )

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, name, ...props },
  ref
) {
  const { variant } = useForm()
  const { error } = useFormField(name)

  return (
    <Form.Field
      name={name}
      className="flex flex-col gap-2"
      serverInvalid={!!error}
    >
      {label && <Label required={props.required}>{label}</Label>}
      <Form.Control asChild>
        <input
          name={name}
          {...props}
          ref={ref}
          className={inputClasses(variant, props)}
        />
      </Form.Control>
      {label && <Messages label={label} name={name} {...props} />}
    </Form.Field>
  )
})
