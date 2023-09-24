'use client'

import * as Form from '@radix-ui/react-form'
import { Label } from './label'
import { Messages } from './messages'
import { Check } from 'react-feather'

export type CheckboxProps = {
  label: string
  name: string
} & Omit<React.ComponentProps<'input'>, 'type' | 'value'>

export function Checkbox({ label, name, ...props }: CheckboxProps) {
  return (
    <Form.Field name={name} className="flex flex-col gap-2">
      <Label required={props.required} className="!text-12">
        <div className="flex h-6 w-6 items-center justify-center rounded-sm border border-gray-300 p-0.5">
          <Form.Control asChild>
            <input
              name={name}
              {...props}
              type="checkbox"
              className="peer h-0 w-0 opacity-0"
            />
          </Form.Control>
          <Check
            strokeWidth={1}
            size={24}
            className="animate-fade-in hidden peer-checked:block"
          />
        </div>
        {label}
      </Label>
      <Messages label={label} {...props} />
    </Form.Field>
  )
}
