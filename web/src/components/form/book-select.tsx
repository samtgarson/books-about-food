import { BookLibrarySearchResult } from '@books-about-food/core/services/books/library/search-library'
import cn from 'classnames'
import { forwardRef } from 'react'
import { Stringified } from 'src/utils/superjson'
import { Select, SelectControl } from './select'

type BookSelectProps = {
  label?: string
  name: string
  value?: BookLibrarySearchResult
  loadOptions: (
    query: string
  ) => Promise<Stringified<BookLibrarySearchResult[]>>
  onChange: (value?: BookLibrarySearchResult) => void
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
        render={BookResult}
        multi={false}
        onCreate={async (title) =>
          ({ title, id: 'new' }) as BookLibrarySearchResult
        }
      />
    )
  }
)

export function BookResult(result: BookLibrarySearchResult) {
  const title = result.title
  const authors = result.authors ?? []

  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="flex w-14 flex-shrink-0 flex-grow-0 justify-center">
        {result.image ? (
          <img src={result.image} alt={result.title} className="h-12" />
        ) : (
          <div className="bg-sand h-12 w-10" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <p
          className={cn(
            'font-bold overflow-ellipsis overflow-hidden',
            authors.length ? 'whitespace-nowrap' : 'max-h-12'
          )}
        >
          {title}
        </p>
        {authors.length > 0 && (
          <p className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap opacity-50">
            {authors.join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
