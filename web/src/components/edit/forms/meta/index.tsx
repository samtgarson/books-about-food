import { PageBackLink } from 'src/components/atoms/page-back-link'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { createAction } from '../action'
import { TagSelect } from './tag-select'

export const EditMetaForm = async ({ book }: { book: FullBook }) => {
  return (
    <Form action={createAction(book.slug)}>
      <PageBackLink href={`/edit/${book.slug}`}>
        Add Further Information
      </PageBackLink>
      <Input
        label="No of pages"
        defaultValue={book.pages}
        name="pages"
        type="number"
        min={0}
      />
      <Input
        label="Release Date"
        defaultValue={book.releaseDate?.toISOString().split('T')[0]}
        name="releaseDate"
        type="date"
      />
      <TagSelect value={book.tags} />
      <Submit variant="dark">Save and Continue</Submit>
    </Form>
  )
}