import { PageBackLink } from 'src/components/atoms/page-back-link'
import { Form } from 'src/components/form'
import { ImageUpload } from 'src/components/form/image-upload'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { createAction } from '../action'

export const UploadForm = async ({ book }: { book: FullBook }) => {
  return (
    <Form action={createAction(book.slug)}>
      <PageBackLink href={`/edit/${book.slug}`}>Upload Images</PageBackLink>
      <ImageUpload
        label="Cover"
        name="coverImageId"
        required
        value={book.cover}
        data-superjson
      />
      <ImageUpload
        label="Spreads"
        name="previewImageIds"
        multi
        value={book.previewImages}
        data-superjson
      />
      <Submit variant="dark">Save and Continue</Submit>
    </Form>
  )
}
