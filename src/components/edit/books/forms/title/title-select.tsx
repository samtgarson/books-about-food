'use client'

import { search } from 'src/components/books/new-book-button/action'
import { BookSelect } from 'src/components/form/book-select'
import { useDebouncedPromise } from 'src/hooks/use-debounce-promise'
import { parse } from 'src/utils/superjson'
import { TitleSelectChangeAttrs, fetchAttrs } from './action'

export function TitleSelect({
  onChange
}: {
  onChange?: (value: TitleSelectChangeAttrs | null) => void
}) {
  const loadOptions = useDebouncedPromise(search, 250)

  return (
    <BookSelect
      name="bookSearch"
      loadOptions={loadOptions}
      label="Title"
      allowCreate
      required
      onChange={async (value) => {
        if (!value) return onChange?.(null)
        if (value.id === 'new') return onChange?.({ title: value.title })

        const attrs = await fetchAttrs(value.id)
        if (attrs) onChange?.(parse(attrs))
      }}
    />
  )
}
