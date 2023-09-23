'use client'

import * as Form from '@radix-ui/react-form'
import { Label } from './label'
import { Messages } from './messages'
import { useForm } from './context'
import cn from 'classnames'

export type InputProps = {
  label: string
  name: string
} & React.ComponentProps<'textarea'>

export function TextArea({ label, name, ...props }: InputProps) {
  const { variant } = useForm()

  return (
    <Form.Field name={name} className="flex flex-col gap-2">
      <Label required={props.required}>{label}</Label>
      <Form.Control asChild>
        <textarea
          name={name}
          {...props}
          className={cn(
            'bg-white transition-colors bg-opacity-60 focus:bg-opacity-100 focus:outline-none p-4 placeholder:text-black/20',
            variant === 'bordered' && 'border border-neutral-grey'
          )}
        />
      </Form.Control>
      <Messages label={label} {...props} />
    </Form.Field>
  )
}
