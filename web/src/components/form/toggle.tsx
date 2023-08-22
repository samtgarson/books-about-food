'use client'

import * as Form from '@radix-ui/react-form'
import { Label } from './label'
import { Messages } from './messages'

export type ToggleProps = {
  label: string
  name: string
} & Omit<React.ComponentProps<'input'>, 'type' | 'value' | 'defaultValue'>

export function Toggle({ label, name, ...props }: ToggleProps) {
  return (
    <Form.Field name={name} className="flex flex-col gap-2">
      <Label required={props.required} className="!text-12">
        <div className="w-8 h-5 p-1 border border-black rounded-full flex items-center justify-start">
          <Form.Control asChild>
            <input
              name={name}
              {...props}
              type="checkbox"
              className="opacity-0 h-0 w-0 peer"
            />
          </Form.Control>
          <div className="w-3 h-3 rounded-full border border-black peer-checked:translate-x-[90%] peer-checked:bg-black transition"></div>
        </div>
        {label}
      </Label>
      <Messages label={label} {...props} />
    </Form.Field>
  )
}
