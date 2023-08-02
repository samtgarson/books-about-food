import { PageBackLink } from 'src/components/atoms/page-back-link'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { createAction } from '../action'
import { Select } from 'src/components/form/select'
import { profiles } from 'src/services/server-actions'

export const EditTitleForm = async ({ book }: { book: FullBook }) => {
  return (
    <Form action={createAction(book.slug)}>
      <PageBackLink href={`/edit/${book.slug}`}>
        Add Title and Author(s)
      </PageBackLink>
      <Input label="Title" defaultValue={book.title} name="title" required />
      <Input label="Subtitle" defaultValue={book.subtitle} name="subtitle" />
      <Select
        loadOptions={profiles}
        label="Author(s)"
        name="authorNames"
        valueKey="name"
        render="name"
        defaultValue={book.authors}
        required
        multi
        allowCreate
        data-superjson
      />
      <Submit variant="dark">Save and Continue</Submit>
    </Form>
  )
}
