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
        <div className="w-6 h-6 p-0.5 border border-gray-300 rounded-sm flex items-center justify-center">
          <Form.Control asChild>
            <input
              name={name}
              {...props}
              type="checkbox"
              className="opacity-0 h-0 w-0 peer"
            />
          </Form.Control>
          <Check
            strokeWidth={1}
            size={24}
            className="hidden peer-checked:block animate-fade-in"
          />
        </div>
        {label}
      </Label>
      <Messages label={label} {...props} />
    </Form.Field>
  )
}
