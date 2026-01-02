import { PageSubtitle } from 'src/components/atoms/page-title'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/core/models/full-book'
import { createAction } from '../action'
import { EditForm } from '../form'
import { TitleFormContent } from './form-content'

export const EditTitleForm = async ({ book }: { book: FullBook }) => {
  return (
    <EditForm action={createAction(book.slug)}>
      <PageSubtitle>General Information</PageSubtitle>
      <Input label="Title" defaultValue={book.title} name="title" required />
      <TitleFormContent book={book} />
      <Submit>Save and Continue</Submit>
    </EditForm>
  )
}
