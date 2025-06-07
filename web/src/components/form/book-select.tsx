import { BookResult } from '@books-about-food/core/models/types'
import cn from 'classnames'
import { forwardRef } from 'react'
import { Stringified } from 'src/utils/superjson'
import { Select, SelectControl } from './select'

type BookSelectProps = {
  label?: string
  name: string
  value?: BookResult
  loadOptions: (query: string) => Promise<Stringified<BookResult[]>>
  onChange: (value?: BookResult) => void
  allowCreate?: boolean
  required?: boolean
  placeholder?: string
}

export const BookSelect = forwardRef<SelectControl, BookSelectProps>(
  function BookSelect({ placeholder = 'Select a book', ...props }, ref) {
    return (
      <Select
        ref={ref}
        {...props}
        placeholder={placeholder}
        valueKey="id"
        render={BookResultRow}
        multi={false}
        onCreate={async (title) => ({ title, id: 'new' }) as BookResult}
      />
    )
  }
)

export function BookResultRow(result: BookResult) {
  const title = result.title
  const authors = result.authors ?? []

  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="flex w-14 shrink-0 grow-0 justify-center">
        {result.image ? (
          <img src={result.image} alt={result.title} className="h-12" />
        ) : (
          <div className="h-12 w-10 bg-sand" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <p
          className={cn(
            'font-bold overflow-hidden text-ellipsis',
            authors.length ? 'whitespace-nowrap' : 'max-h-12'
          )}
        >
          {title}
        </p>
        {authors.length > 0 && (
          <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap opacity-50">
            {authors.join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
