'use client'
import * as Sheet from 'src/components/atoms/sheet'
import * as BookItem from 'src/components/books/item'
import { Plus } from 'react-feather'
import { Form } from 'src/components/form'
import { action, search } from './action'
import { Submit } from 'src/components/form/submit'
import { Select, SelectValue } from 'src/components/form/select'
import { BookLibrarySearchResult } from 'src/services/books/library/search-library'
import { useDebouncedPromise } from 'src/hooks/use-debounce-promise'
import { useState } from 'react'
import { CreateBookInput } from 'src/services/books/create-book'

export const NewBookButton = () => {
  const loadOptions = useDebouncedPromise(search, 250)
  const [value, setValue] = useState<CreateBookInput | null>(null)

  return (
    <Sheet.Root>
      <BookItem.Container>
        <Sheet.Trigger className="w-full self-start">
          <BookItem.Box className="flex-col gap-4">
            <Plus strokeWidth={1} size={48} />
            <p>New Cookbook</p>
          </BookItem.Box>
        </Sheet.Trigger>
      </BookItem.Container>
      <Sheet.Content>
        <Form
          action={async () => {
            value && action(value)
          }}
        >
          <Sheet.Body grey>
            <Sheet.Header title="Submit a new cookbook" />
            <Select
              name="title"
              loadOptions={loadOptions}
              valueKey="id"
              label="Title"
              render={BookResult}
              required
              allowCreate
              multi={false}
              onChange={(value) => {
                if (!value) return
                if (value.__new) setValue({ title: value.id })
                else setValue({ googleBooksId: value.id })
              }}
            />
          </Sheet.Body>
          <Sheet.Footer>
            <Submit className="w-full pt-4 pb-6 sm:pt-6 -mt-4">Create</Submit>
          </Sheet.Footer>
        </Form>
      </Sheet.Content>
    </Sheet.Root>
  )
}

const BookResult = (result: BookLibrarySearchResult & SelectValue<'title'>) => {
  const title = result.__new ? result.id : result.title
  const authors = result.__new ? [] : result.authors

  return (
    <div className="flex items-center gap-3">
      <div className="w-14 flex justify-center flex-grow-0 flex-shrink-0">
        {result.image ? (
          <img src={result.image} alt={result.title} className="h-12" />
        ) : (
          <div className="h-12 w-10 bg-sand" />
        )}
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <p className="font-bold">{title}</p>
        {authors.length > 0 && (
          <p className="opacity-50 whitespace-nowrap overflow-hidden overflow-ellipsis max-w-full">
            {authors.join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
