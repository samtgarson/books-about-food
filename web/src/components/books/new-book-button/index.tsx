'use client'
import cn from 'classnames'
import { ReactNode, useState } from 'react'
import { Plus } from 'src/components/atoms/icons'
import * as Sheet from 'src/components/atoms/sheet'
import { TitleSelectChangeAttrs } from 'src/components/edit/books/forms/title/action'
import { TitleFormContent } from 'src/components/edit/books/forms/title/form-content'
import { TitleSelect } from 'src/components/edit/books/forms/title/title-select'
import { Form } from 'src/components/form'
import { Submit } from 'src/components/form/submit'
import { action } from './action'

export const NewBookButton = ({
  children,
  className
}: {
  children?: ReactNode
  className?: string
}) => {
  const [values, setValues] = useState<TitleSelectChangeAttrs | null>(null)
  const { googleBooksId, cover, ...book } = values || {}

  const triggerContent = children ?? (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
        <Plus size={23} strokeWidth={1} />
      </div>
      <p className="text-left">Submit a new cookbook</p>
    </>
  )
  return (
    <Sheet.Root onClose={() => setValues(null)}>
      <Sheet.Trigger
        className={cn('flex items-center gap-4', className)}
        aria-label="Submit a new cookbook"
      >
        {triggerContent}
      </Sheet.Trigger>
      <Sheet.Content authenticated>
        <Sheet.Body title="Submit a new cookbook">
          <Form action={action} variant="bordered">
            <TitleSelect onChange={setValues} />
            {values?.title && <TitleFormContent book={book} />}
            <input type="hidden" name="title" value={book.title} />
            <input type="hidden" name="googleBooksId" value={googleBooksId} />
            <input type="hidden" name="cover" value={cover} />
            <Submit className="w-full">Save & continue</Submit>
          </Form>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}
