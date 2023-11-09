import { FullBook } from 'core/models/full-book'
import { PageSubtitle } from 'src/components/atoms/page-title'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { createAction } from '../action'
import { TitleFormContent } from './form-content'

export const EditTitleForm = async ({ book }: { book: FullBook }) => {
  return (
    <Form action={createAction(book.slug)}>
      <PageSubtitle>General Information</PageSubtitle>
      <Input label="Title" defaultValue={book.title} name="title" required />
      <TitleFormContent book={book} />
      <Submit variant="dark">Save and Continue</Submit>
    </Form>
  )
}
