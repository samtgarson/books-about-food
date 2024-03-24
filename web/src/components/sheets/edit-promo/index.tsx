'use client'
import { Promo } from '@books-about-food/core/models/promo'
import { bookToResult } from '@books-about-food/core/services/books/utils/to-result'
import { upsertPromoSchema } from '@books-about-food/core/services/publishers/schemas/upsert-promo'
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

export type EditPromoSheetProps = {
  publisherSlug: string
  promo?: Promo
}

const EditPromoSheet: SheetComponent<EditPromoSheetProps> = ({
  publisherSlug,
  promo
}) => {
  const { closeSheet } = useSheet()

  return (
    <Content>
      <Body title={promo ? 'Edit Promo' : 'Create Promo'}>
        <Form
          variant="bordered"
          schema={upsertPromoSchema}
          action={action}
          successMessage="Promo saved!"
        >
          <input type="hidden" name="publisherSlug" value={publisherSlug} />
          {promo && <input type="hidden" name="id" value={promo.id} />}
          <Input name="title" label="Title" defaultValue={promo?.title} />
          <BookMultiSelect
            name="bookIds"
            label="Books"
            loadOptions={(search) => fetchOptions(publisherSlug, search)}
            value={promo?.books.map(bookToResult)}
          />
          <div className="flex gap-2">
            <Submit className="grow">Save</Submit>
            {promo && (
              <Button
                variant="danger"
                title="Clear this promo"
                formAction={async function (data) {
                  await clear(data)
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

export default EditPromoSheet
