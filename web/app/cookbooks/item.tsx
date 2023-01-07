import { Book } from 'database'
import Link from 'next/link'
import { imageSrc } from 'src/utils/image-helpers'

export type CookbookItemProps = {
  book: Book
}

export const CookbookItem = ({ book }: CookbookItemProps) => (
  <li>
    <Link href={`/cookbooks/${book.slug}`}>
      {book.coverUrl ? (
        <img
          alt={`Cover for ${book.title}`}
          src={imageSrc(book.coverUrl)}
          className='h-20'
        />
      ) : (
        <div className='h-20 w-16 bg-gray-200' />
      )}
      <p>{book.title}</p>
    </Link>
  </li>
)
