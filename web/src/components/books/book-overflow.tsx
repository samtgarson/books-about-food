'use client'

import { FullBook } from '@books-about-food/core/models/full-book'
import Link from 'next/link'
import { ArrowRight, Edit2 } from 'react-feather'
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
        <Edit2 strokeWidth={1} />
        Suggest an edit
      </Overflow.Item>
      <Overflow.Item asChild variant="admin">
        <Link href={`/edit/${book.slug}`}>
          <ArrowRight strokeWidth={1} />
          Edit Book
        </Link>
      </Overflow.Item>
      <Overflow.Item asChild variant="admin">
        <Link
          href={`https://app.forestadmin.com/Books%20About%20Food/Production/Core%20Team/data/books/index/record/books/${book.id}/details`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ArrowRight strokeWidth={1} />
          View in Foroest
        </Link>
      </Overflow.Item>
    </Overflow.Root>
  )
}
