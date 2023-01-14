import Img from 'next/image'
import Link from 'next/link'
import { Book } from 'src/models/book'

export type CookbookItemProps = {
  book: Book
}

export const CookbookItem = ({ book }: CookbookItemProps) => {
  return (
    <li>
      <Link href={`/cookbooks/${book.slug}`}>
        {book.cover ? (
          <Img
            alt={book.cover.caption}
            src={book.cover.src}
            width={book.cover.widthFor(80)}
            height={80}
          />
        ) : (
          <div className='h-20 w-16 bg-white' />
        )}
        <p>{book.title}</p>
      </Link>
    </li>
  )
}
