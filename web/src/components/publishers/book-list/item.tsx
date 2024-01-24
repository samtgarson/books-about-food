'use client'

import { Book } from '@books-about-food/core/models/book'
import { EditableBookItem } from 'src/components/edit/in-place/editable-book-item'
import { toggleItem } from 'src/utils/array-helpers'
import { useEditPublisher } from '../edit/context'
import { updateVisibility } from './action'

type PublisherBookListItemProps = {
  book: Book
  hidden: boolean
}
export function PublisherBookListItem({
  book,
  hidden
}: PublisherBookListItemProps) {
  const { editMode, publisher } = useEditPublisher()

  return (
    <EditableBookItem
      book={book}
      editMode={editMode}
      hidden={hidden}
      updateVisibility={async function (newValue: boolean) {
        const updatedHidden = toggleItem(
          publisher.hiddenBooks,
          book.id,
          newValue
        )

        await updateVisibility(publisher.slug, updatedHidden)
      }}
    />
  )
}
