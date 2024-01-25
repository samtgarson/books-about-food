'use client'

import { BookLibrarySearchResult } from '@books-about-food/core/services/books/library/search-library'
import * as Form from '@radix-ui/react-form'
import { AnimatePresence, Reorder } from 'framer-motion'
import { useRef, useState } from 'react'
import { Menu, X } from 'react-feather'
import { Stringified } from 'src/utils/superjson'
import { BookResult, BookSelect } from './book-select'
import { Label } from './label'
import { SelectControl } from './select'

type BookMultiSelectProps = {
  name: string
  label?: string
  value?: BookLibrarySearchResult[]
  loadOptions: (
    search: string
  ) => Promise<Stringified<BookLibrarySearchResult[]>>
  required?: boolean
}

export function BookMultiSelect({
  value: defaultValue = [],
  loadOptions,
  name,
  label,
  required
}: BookMultiSelectProps) {
  const [values, setValues] = useState<BookLibrarySearchResult[]>(defaultValue)
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
              className="flex py-2 pr-2 items-center gap-2 overflow-hidden"
            >
              <Menu strokeWidth={1} size={15} />
              <BookResult {...value} />
              <button
                className="ml-auto"
                title={`Remove ${value.title}`}
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
          if (value)
            setValues((v) =>
              [...v, value].filter((v, i, a) => a.indexOf(v) === i)
            )
          select.current?.clear()
        }}
        loadOptions={loadOptions}
      />
    </Form.Field>
  )
}