import { PageBackLink } from 'src/components/atoms/page-back-link'
import { Form } from 'src/components/form'
import { ImageUpload } from 'src/components/form/image-upload'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { createAction } from '../action'
import { Checkbox } from 'src/components/form/checkbox'

export const UploadForm = async ({ book }: { book: FullBook }) => {
  return (
    <Form action={createAction(book.slug)}>
      <PageBackLink href={`/edit/${book.slug}`}>Cover & Spreads</PageBackLink>
      <p className="mb-4">
        Only upload good quality flat images of the cover and spreads—not
        photographs of them.
      </p>
      <ImageUpload
        label="Cover"
        name="coverImageId"
        required={{ ifNot: 'noCover' }}
        defaultValue={book.cover}
        data-superjson
        prefix={`books/${book.id}/cover`}
      />
      <div className="flex flex-col gap-2">
        <Checkbox
          name="noCover"
          label="This book doesn't have a cover design yet"
        />
      </div>
      <ImageUpload
        label="Spreads"
        name="previewImageIds"
        multi
        defaultValue={book.previewImages}
        prefix={`books/${book.id}/previews`}
        data-superjson
        className="mb-4"
      />
      <Submit variant="dark">Save and Continue</Submit>
    </Form>
  )
}
