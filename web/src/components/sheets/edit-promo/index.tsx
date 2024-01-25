'use client'
import { Promo } from '@books-about-food/core/models/promo'
import { bookToResult } from '@books-about-food/core/services/books/utils/to-result'
import { upsertPromoSchema } from '@books-about-food/core/services/publishers/schemas/upsert-promo'
import { Body, Content } from 'src/components/atoms/sheet'
import { Form } from 'src/components/form'
import { BookMultiSelect } from 'src/components/form/book-multi-select'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { SheetComponent } from 'src/components/sheets/types'
import { action, fetchOptions } from './action'

export type EditPromoSheetProps = {
  publisherSlug: string
  promo?: Promo
}

export const EditPromoSheet: SheetComponent<EditPromoSheetProps> = ({
  publisherSlug,
  promo
}) => {
  return (
    <Content>
      <Body title="Edit Promo">
        <Form
          variant="bordered"
          schema={upsertPromoSchema}
          action={action}
          successMessage="Promo created successfully!"
        >
          <input type="hidden" name="publisherSlug" value={publisherSlug} />
          {promo && <input type="hidden" name="promoId" value={promo.id} />}
          <Input name="title" label="Title" defaultValue={promo?.title} />
          <BookMultiSelect
            name="bookIds"
            label="Books"
            loadOptions={(search) => fetchOptions(publisherSlug, search)}
            value={promo?.books.map(bookToResult)}
          />
          <Submit>Save</Submit>
        </Form>
      </Body>
    </Content>
  )
}
