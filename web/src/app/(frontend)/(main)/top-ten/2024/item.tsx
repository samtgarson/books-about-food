import { Book as Model } from '@books-about-food/core/models/book'
import cn from 'classnames'
import * as Book from 'src/components/books/item'

export function TopTenGridItem({
  book,
  disabled,
  selected,
  onClick
}: {
  book: Model
  disabled: boolean
  selected: boolean
  onClick: () => void
}) {
  return (
    <Book.Container
      key={book.id}
      book={book}
      centered
      link={false}
      onClick={onClick}
      disabled={disabled}
    >
      <div
        className={cn(
          'absolute inset-0 z-[-1] bg-black transition ease-out sm:inset-[-18px]',
          selected || 'opacity-0 sm:scale-[0.97]'
        )}
      />
      <Book.Cover book={book} colorful={selected} />
      <Book.Footer
        book={book}
        className={cn(
          '!sm:px-6 transition-colors ease-out sm:text-center',
          selected && 'text-white'
        )}
      />
    </Book.Container>
  )
}
