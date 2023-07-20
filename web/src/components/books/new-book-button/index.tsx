'use client'
import * as Sheet from 'src/components/atoms/sheet'
import * as BookItem from 'src/components/books/item'
import { Plus } from 'react-feather'
import { Form } from 'src/components/form'
import { createBook } from './action'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'

export const NewBookButton = () => {
  return (
    <Sheet.Root>
      <Sheet.Trigger>
        <BookItem.Container>
          <BookItem.Box className="flex-col gap-4">
            <Plus strokeWidth={1} size={48} />
            <p>New Cookbook</p>
          </BookItem.Box>
        </BookItem.Container>
      </Sheet.Trigger>
      <Sheet.Content>
        <Form action={createBook}>
          <Sheet.Body grey>
            <Sheet.Header title="Submit a new cookbook" />
            <Input
              placeholder="My first book"
              name="title"
              label="Title"
              required
            />
          </Sheet.Body>
          <Sheet.Footer>
            <Submit className="w-full pt-4 pb-6 sm:pt-6">Create</Submit>
          </Sheet.Footer>
        </Form>
      </Sheet.Content>
    </Sheet.Root>
  )
}
