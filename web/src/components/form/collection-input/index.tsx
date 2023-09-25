'use client'

import * as Form from '@radix-ui/react-form'
import { useState } from 'react'
import { Plus } from 'react-feather'
import * as Sheet from 'src/components/atoms/sheet'
import { Serializable } from 'src/utils/types'
import { stringify } from 'superjson'
import { Label } from '../label'
import { Messages } from '../messages'
import { createCollectionInputContext } from './context'
import { CollectionInputItem } from './item'
import { SheetContent } from './sheet-content'
import { CollectionInputProps } from './types'

export function CollectionInput<
  Value extends { id: string },
  Serialized extends Serializable = Value
>({
  label,
  name,
  defaultValue = [],
  render,
  form: FormComponent,
  serialize,
  ...props
}: CollectionInputProps<Value, Serialized>) {
  const [value, setValue] = useState<Value[]>(defaultValue)
  const Context = createCollectionInputContext<Value>()

  return (
    <Context.Provider
      value={{
        FormComponent,
        addValue: (val) => {
          const existing = value.findIndex((v) => v.id === val.id)
          const index = existing >= 0 ? existing : value.length
          setValue((v) => [...v.slice(0, index), val, ...v.slice(index + 1)])
        },
        removeValue: (id) => {
          setValue((v) => v.filter((v) => v.id !== id))
        }
      }}
    >
      <Form.Field name={name} className="flex flex-col gap-2">
        <Label required={props.required}>{label}</Label>
        <div className="flex flex-col">
          {value.map((v, i) => (
            <CollectionInputItem key={i} value={v} {...render(v)} />
          ))}
        </div>
        <Form.Control asChild>
          <input
            name={name}
            {...props}
            className="h-0"
            value={
              value.length
                ? stringify(value.map((v) => (serialize ? serialize(v) : v)))
                : ''
            }
          />
        </Form.Control>
        <Sheet.Root>
          <Sheet.Trigger className="flex items-center justify-center bg-white p-7">
            <Plus strokeWidth={1} size={24} />
          </Sheet.Trigger>
          <SheetContent<Value> />
        </Sheet.Root>
        <Messages label={label} {...props} />
      </Form.Field>
    </Context.Provider>
  )
}
