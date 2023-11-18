'use client'
import { useState } from 'react'
import { Plus } from 'react-feather'
import * as Sheet from 'src/components/atoms/sheet'
import * as BookItem from 'src/components/books/item'
import { TitleSelectChangeAttrs } from 'src/components/edit/forms/title/action'
import { TitleFormContent } from 'src/components/edit/forms/title/form-content'
import { TitleSelect } from 'src/components/edit/forms/title/title-select'
import { Form } from 'src/components/form'
import { Submit } from 'src/components/form/submit'
import { action } from './action'

export const NewBookButton = () => {
  const [values, setValues] = useState<TitleSelectChangeAttrs | null>(null)
  const { googleBooksId, cover, ...book } = values || {}

  return (
    <Sheet.Root onClose={() => setValues(null)}>
      <BookItem.Container>
        <Sheet.Trigger className="w-full self-start">
          <BookItem.Box className="flex-col gap-4">
            <Plus strokeWidth={1} size={48} />
            <p>New Cookbook</p>
          </BookItem.Box>
        </Sheet.Trigger>
      </BookItem.Container>
      <Sheet.Content>
        <Sheet.Body title="Submit a new cookbook">
          <Form action={action} variant="bordered">
            <TitleSelect onChange={setValues} />
            {values && <TitleFormContent book={book} />}
            <input type="hidden" name="title" value={book.title} />
            <input type="hidden" name="googleBooksId" value={googleBooksId} />
            <input type="hidden" name="cover" value={cover} />
            <Submit variant="dark" className="w-full">
              Save & continue
            </Submit>
          </Form>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}
