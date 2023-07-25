import { PageBackLink } from 'src/components/atoms/page-back-link'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { createAction } from '../action'

export const EditTitleForm = ({ book }: { book: FullBook }) => {
  return (
    <Form className="gap-4" action={createAction(book.slug, '')}>
      <PageBackLink href={`/edit/${book.slug}`}>
        Add Title and Author(s)
      </PageBackLink>
      <Input label="Title" value={book.title} name="title" />
      <Input label="Subtitle" value={book.subtitle} name="subtitle" />
      <Submit variant="dark">Save and Continue</Submit>
    </Form>
  )
}
