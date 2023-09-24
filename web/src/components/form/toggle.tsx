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
        <div className="flex h-5 w-8 items-center justify-start rounded-full border border-black p-1">
          <Form.Control asChild>
            <input
              name={name}
              {...props}
              type="checkbox"
              className="peer h-0 w-0 opacity-0"
            />
          </Form.Control>
          <div className="h-3 w-3 rounded-full border border-black transition peer-checked:translate-x-[90%] peer-checked:bg-black"></div>
        </div>
        {label}
      </Label>
      <Messages label={label} {...props} />
    </Form.Field>
  )
}
