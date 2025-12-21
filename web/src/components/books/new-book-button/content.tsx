import { useEffect, useState } from 'react'
import { TitleSelectChangeAttrs } from 'src/components/edit/books/forms/title/action'
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
      {values?.cover && <input type="hidden" name="cover" value={cover} />}
      {values?.subtitle && (
        <input type="hidden" name="subtitle" value={book.subtitle} />
      )}
      {values?.authors && values.authors.length > 0 && (
        <input
          type="hidden"
          name="authorIds"
          value={values.authors.map((author) => author.id).join(',')}
        />
      )}
      {values?.tags && values.tags.length > 0 && (
        <input
          type="hidden"
          name="tags"
          value={values.tags.map((tag) => tag.slug).join(',')}
        />
      )}
      {/*{values?.title && <TitleFormContent book={book} />}*/}
      <Submit className="w-full" disabled={!values?.title}>
        Save & continue
      </Submit>
    </Form>
  )
}
