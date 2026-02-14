import { PageSubtitle } from 'src/components/atoms/page-title'
import { Checkbox } from 'src/components/form/checkbox'
import { ImageUpload } from 'src/components/form/image-upload'
import { Submit } from 'src/components/form/submit'
import { Wrap } from 'src/components/utils/wrap'
import { FullBook } from 'src/core/models/full-book'
import { updateBook } from 'src/core/services/books/update-book'
import { call } from 'src/utils/service'
import { createAction } from '../action'
import { EditForm } from '../form'

export const UploadForm = async ({ book }: { book: FullBook }) => {
  return (
    <EditForm action={createAction(book.slug)}>
      <PageSubtitle>Cover & Spreads</PageSubtitle>
      <p className="mb-4">
        Only upload good quality flat images of the cover and spreads—not
        photographs of them.
      </p>
      <Wrap
        c={ImageUpload}
        label="Cover"
        name="coverImageId"
        required={{ ifNot: 'noCover' }}
        defaultValue={book.cover}
        prefix={`books/${book.id}/cover`}
      />
      <div className="flex flex-col gap-2">
        <Checkbox
          name="noCover"
          label="This book doesn't have a cover design yet"
        />
      </div>
      <Wrap
        c={ImageUpload}
        label="Spreads"
        name="previewImageIds"
        multi
        defaultValue={book.previewImages}
        prefix={`books/${book.id}/previews`}
        className="mb-4"
        onReorderImages={async function (previewImageIds) {
          'use server'
          await call(updateBook, { slug: book.slug, previewImageIds })
        }}
      />
      <Submit>Save and Continue</Submit>
    </EditForm>
  )
}
