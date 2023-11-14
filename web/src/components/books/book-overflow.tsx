'use client'

import { FullBook } from '@books-about-food/core/models/full-book'
import Link from 'next/link'
import { Edit } from 'react-feather'
import * as Overflow from 'src/components/atoms/overflow'
import { useSheet } from '../sheets/global-sheet'

export const BookOverflow = ({
  book,
  ...props
}: { book: FullBook } & Omit<Overflow.RootProps, 'children'>) => {
  const { openSheet } = useSheet()
  return (
    <Overflow.Root {...props}>
      <Overflow.Item
        onClick={() => openSheet('suggestEdit', { resource: book })}
      >
        <Edit strokeWidth={1} />
        Suggest an edit
      </Overflow.Item>
      <Overflow.AdminArea>
        <Overflow.Item asChild>
          <Link href={`/edit/${book.slug}`}>Edit Book</Link>
        </Overflow.Item>
      </Overflow.AdminArea>
    </Overflow.Root>
  )
}
