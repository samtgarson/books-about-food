'use client'

import { Book } from '@books-about-food/core/models/book'
import { FC, useMemo } from 'react'
import { EditableBookItem } from 'src/components/edit/in-place/editable-book-item'
import { useEditProfile } from '../context'
import { action } from './action'

type ContributionVisibilityProps = {
  book: Book
  hidden: boolean
}

export const ContributionVisibility: FC<ContributionVisibilityProps> = ({
  book,
  hidden
}) => {
  const { editMode, profile } = useEditProfile()
  const bookId = useMemo(() => book.id, [book.id])

  return (
    <EditableBookItem
      book={book}
      editMode={editMode}
      hidden={hidden}
      updateVisibility={async (hidden) => {
        await action({ profileId: profile.id, bookId, hidden })
      }}
    />
  )
}
