import Image from 'next/image'
import Link from 'next/link'
import { Book } from 'src/models/book'

export type CookbookItemProps = {
  book: Book
}

export const CookbookItem = ({ book }: CookbookItemProps) => {
  return (
    <li className="-mr-px">
      <Link href={`/cookbooks/${book.slug}`} className="h-full flex flex-col">
        <div className="aspect-square border border-black mb-6 relative flex items-center justify-center">
          {book.cover ? (
            <Image
              alt={book.cover.caption}
              src={book.cover.src}
              width={book.cover.widthFor(200)}
              height={200}
              className="absolute !h-[80%] !top-[10%] mx-auto inset-x-0 !w-auto book-shadow"
            />
          ) : (
            <div
              aria-hidden
              className="absolute !h-[80%] !top-[10%] mx-auto inset-x-0 w-[60%] bg-opacity-50 bg-white"
            />
          )}
        </div>
        <p className="font-medium text-16 mb-1 mt-auto">{book.title}</p>
        <p className="text-14">{book.authorNames}</p>
      </Link>
    </li>
  )
}
