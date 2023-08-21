'use client'
import * as Sheet from 'src/components/atoms/sheet'
import * as BookItem from 'src/components/books/item'
import { Plus } from 'react-feather'
import { Form } from 'src/components/form'
import { action } from './action'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'

export const NewBookButton = () => {
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
        <Form action={action}>
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
            <Submit className="w-full pt-4 pb-6 sm:pt-6 -mt-4">Create</Submit>
          </Sheet.Footer>
        </Form>
      </Sheet.Content>
    </Sheet.Root>
  )
}
