'use client'
import { useState } from 'react'
import { Plus } from 'react-feather'
import * as Sheet from 'src/components/atoms/sheet'
import * as BookItem from 'src/components/books/item'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Select } from 'src/components/form/select'
import { Submit } from 'src/components/form/submit'
import { useDebouncedPromise } from 'src/hooks/use-debounce-promise'
import { CreateBookInput } from 'src/services/books/create-book'
import { BookLibrarySearchResult } from 'src/services/books/library/search-library'
import { action, search } from './action'

export const NewBookButton = () => {
  const loadOptions = useDebouncedPromise(search, 250)
  const [value, setValue] = useState<CreateBookInput | null>(null)
  const searchDisabled = !!process.env.NEXT_PUBLIC_DISABLE_LIBRARY_SEARCH

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
        <Sheet.Body>
          <Sheet.Header title="Submit a new cookbook" />
          <Form
            action={async () => {
              if (!value) return
              return action(value)
            }}
            variant="bordered"
          >
            {searchDisabled ? (
              <Input
                name="title"
                label="Title"
                required
                onChange={(e) => {
                  setValue({ title: e.target.value })
                }}
              />
            ) : (
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
            )}
            <Submit variant="dark" className="w-full">
              Create
            </Submit>
          </Form>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
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
