import Link from 'next/link'
import { Edit } from 'react-feather'
import * as Overflow from 'src/components/atoms/overflow'
import { FullBook } from 'src/models/full-book'

export const BookOverflow = ({
  book,
  ...props
}: { book: FullBook } & Omit<Overflow.RootProps, 'children'>) => {
  return (
    <Overflow.Root {...props}>
      <Overflow.Item>
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
