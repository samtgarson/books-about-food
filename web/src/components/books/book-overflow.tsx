import { FullBook } from 'src/models/full-book'
import * as Overflow from 'src/components/atoms/overflow'
import { AlertTriangle, Edit, Lock } from 'react-feather'
import Link from 'next/link'

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
      <Overflow.Item variant="danger">
        <AlertTriangle strokeWidth={1} />
        Report an issue
      </Overflow.Item>
      <Overflow.AdminArea>
        <Overflow.Item asChild>
          <Link href={`/edit/${book.slug}`}>Edit Book</Link>
        </Overflow.Item>
      </Overflow.AdminArea>
    </Overflow.Root>
  )
}
