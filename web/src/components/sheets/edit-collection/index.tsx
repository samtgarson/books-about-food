'use client'
import { Collection } from '@books-about-food/core/models/collection'
import { bookToResult } from '@books-about-food/core/services/books/utils/to-result'
import { upsertCollectionSchema } from '@books-about-food/core/services/collections/schemas/upsert-collection'
import { Button } from 'src/components/atoms/button'
import { Trash2 } from 'src/components/atoms/icons'
import { Body, Content } from 'src/components/atoms/sheet'
import { Form } from 'src/components/form'
import { BookMultiSelect } from 'src/components/form/book-multi-select'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { SheetComponent } from 'src/components/sheets/types'
import { useSheet } from '../global-sheet'
import { action, clear, fetchOptions } from './action'

export type EditCollectionSheetProps = {
  publisherSlug: string
  collection: Collection
}

const EditCollectionSheet: SheetComponent<EditCollectionSheetProps> = ({
  publisherSlug,
  collection
}) => {
  const { closeSheet } = useSheet()

  return (
    <Content>
      <Body title={collection ? 'Edit Collection' : 'Create Collection'}>
        <Form
          variant="bordered"
          schema={upsertCollectionSchema}
          action={action}
          successMessage="Collection saved!"
        >
          <input type="hidden" name="publisherSlug" value={publisherSlug} />
          {collection && (
            <input type="hidden" name="id" value={collection.id} />
          )}
          <Input name="title" label="Title" defaultValue={collection?.title} />
          <BookMultiSelect
            name="bookIds"
            label="Books"
            loadOptions={(search) => fetchOptions(publisherSlug, search)}
            value={collection?.books.map(bookToResult)}
          />
          <div className="flex gap-2">
            <Submit className="grow">Save</Submit>
            {collection && (
              <Button
                variant="danger"
                title="Archive this collection"
                formAction={async function (data) {
                  await clear(data, publisherSlug)
                  closeSheet()
                }}
              >
                <Trash2 strokeWidth={1} />
              </Button>
            )}
          </div>
        </Form>
      </Body>
    </Content>
  )
}

export default EditCollectionSheet
