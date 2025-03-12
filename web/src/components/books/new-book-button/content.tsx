import { useEffect, useState } from 'react'
import { TitleSelectChangeAttrs } from 'src/components/edit/books/forms/title/action'
import { TitleFormContent } from 'src/components/edit/books/forms/title/form-content'
import { TitleSelect } from 'src/components/edit/books/forms/title/title-select'
import { Form } from 'src/components/form'
import { Submit } from 'src/components/form/submit'
import { action } from './action'

export function NewBookForm() {
  const [values, setValues] = useState<TitleSelectChangeAttrs | null>(null)
  const { googleBooksId, cover, ...book } = values || {}

  useEffect(() => {
    return () => {
      setValues(null)
    }
  }, [])

  return (
    <Form action={action} variant="bordered">
      <TitleSelect onChange={setValues} />
      <input type="hidden" name="title" value={book.title ?? ''} />
      <input type="hidden" name="googleBooksId" value={googleBooksId ?? ''} />
      <input type="hidden" name="cover" value={cover} />
      {values?.title && <TitleFormContent book={book} />}
      {values?.title && <Submit className="w-full">Save & continue</Submit>}
    </Form>
  )
}
