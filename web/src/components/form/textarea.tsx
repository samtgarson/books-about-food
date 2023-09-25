'use client'

import * as Form from '@radix-ui/react-form'
import cn from 'classnames'
import { useForm } from './context'
import { Label } from './label'
import { Messages } from './messages'

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
            'bg-white bg-opacity-60 p-4 transition-colors placeholder:text-black/20 focus:bg-opacity-100 focus:outline-none',
            variant === 'bordered' && 'border-neutral-grey border'
          )}
        />
      </Form.Control>
      <Messages label={label} {...props} />
    </Form.Field>
  )
}
