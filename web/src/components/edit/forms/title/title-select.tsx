'use client'

import { search } from 'src/components/books/new-book-button/action'
import { Select } from 'src/components/form/select'
import { useDebouncedPromise } from 'src/hooks/use-debounce-promise'
import { BookLibrarySearchResult } from 'src/services/books/library/search-library'
import { parse } from 'src/utils/superjson'
import { TitleSelectChangeAttrs, fetchAttrs } from './action'

export function TitleSelect({
  onChange
}: {
  onChange?: (value: TitleSelectChangeAttrs | null) => void
}) {
  const loadOptions = useDebouncedPromise(search, 250)

  return (
    <>
      <Select
        name="bookSearch"
        loadOptions={loadOptions}
        valueKey="id"
        label="Title"
        render={BookResult}
        required
        allowCreate
        multi={false}
        onChange={async (value) => {
          if (!value) return onChange?.(null)
          if (value.__new) return onChange?.({ title: value.id })

          const attrs = await fetchAttrs(value.id)
          if (attrs) onChange?.(parse(attrs))
        }}
      />
    </>
  )
}
const BookResult = (result: BookLibrarySearchResult, newValue: boolean) => {
  const title = newValue ? result.id : result.title
  const authors = newValue ? [] : result.authors

  return (
    <div className="flex items-center gap-3">
      <div className="flex w-14 flex-shrink-0 flex-grow-0 justify-center">
        {result.image ? (
          <img src={result.image} alt={result.title} className="h-12" />
        ) : (
          <div className="bg-sand h-12 w-10" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="font-bold">{title}</p>
        {authors.length > 0 && (
          <p className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap opacity-50">
            {authors.join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
