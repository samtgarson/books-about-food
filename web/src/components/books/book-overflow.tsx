'use client'

import { FullBook } from '@books-about-food/core/models/full-book'
import { PencilMini } from 'src/components/atoms/icons'
import * as Overflow from 'src/components/atoms/overflow'
import { usePolicy } from 'src/hooks/use-policy'
import { useSheet } from '../sheets/global-sheet'

export const BookOverflow = ({
  book,
  ...props
}: { book: FullBook } & Omit<Overflow.RootProps, 'children'>) => {
  const { openSheet } = useSheet()
  const bookPolicy = usePolicy(book)

  return (
    <Overflow.Root {...props}>
      <Overflow.Item
        onClick={() => openSheet('suggestEdit', { resource: book })}
        icon={PencilMini}
      >
        Suggest an edit
      </Overflow.Item>
      {bookPolicy?.update && (
        <Overflow.Item href={`/edit/${book.slug}`}>Edit Book</Overflow.Item>
      )}
      <Overflow.Item
        variant="admin"
        href={`https://app.forestadmin.com/Books%20About%20Food/Production/Core%20Team/data/books/index/record/books/${book.id}/details`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View in Forest
      </Overflow.Item>
    </Overflow.Root>
  )
}
