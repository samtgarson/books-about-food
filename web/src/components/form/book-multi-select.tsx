'use client'

import { AnimatePresence, Reorder } from 'framer-motion'
import { Form } from 'radix-ui'
import { useRef, useState } from 'react'
import { Menu, X } from 'src/components/atoms/icons'
import { BookResult } from 'src/core/models/types'
import { Stringified } from 'src/utils/superjson'
import { BookResultRow, BookSelect } from './book-select'
import { Label } from './label'
import { SelectControl } from './select'

type BookMultiSelectProps = {
  name: string
  label?: string
  value?: BookResult[]
  loadOptions: (search: string) => Promise<Stringified<BookResult[]>>
  required?: boolean
}

export function BookMultiSelect({
  value: defaultValue = [],
  loadOptions,
  name,
  label,
  required
}: BookMultiSelectProps) {
  const [values, setValues] = useState<BookResult[]>(defaultValue)
  const select = useRef<SelectControl>(null)

  return (
    <Form.Field name={name} className="flex flex-col gap-2">
      <Form.Control asChild value={values.map((v) => v.id)}>
        <input type="hidden" />
      </Form.Control>
      {label && <Label required={required}>{label}</Label>}
      <Reorder.Group
        axis="y"
        values={values}
        onReorder={setValues}
        className="empty:hidden"
      >
        <AnimatePresence>
          {values.map((value) => (
            <Reorder.Item
              key={value.id}
              value={value}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 64 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 overflow-hidden py-2 pr-2"
            >
              <Menu strokeWidth={1} size={15} />
              <BookResultRow {...value} />
              <button
                className="ml-auto"
                title={`Remove ${value.title}`}
                type="button"
                onClick={function () {
                  setValues(values.filter((v) => v.id !== value.id))
                }}
              >
                <X size={16} strokeWidth={1} />
              </button>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
      <BookSelect
        ref={select}
        name="bookSearch"
        onChange={(value) => {
          if (value && !values.find((v) => v.id === value.id))
            setValues((v) =>
              [...v, value].filter((v, i, a) => a.indexOf(v) === i)
            )
          console.log('select.current', select.current)
          select.current?.clear()
        }}
        loadOptions={loadOptions}
      />
    </Form.Field>
  )
}
