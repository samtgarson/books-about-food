import cn from 'classnames'
import Color from 'color'
import { CSSProperties, useMemo } from 'react'
import { Book } from 'src/core/models/book'
import { shuffle } from 'src/utils/array-helpers'

export function Bookshelf({
  books,
  className
}: {
  books: Book[]
  className?: string
}) {
  const items = useMemo(() => {
    const heights = shuffle(
      [...new Array(books.length)].map((_, i) => i * (20 / books.length))
    )

    return books.map((book, i) => {
      const color = new Color(book.colors[0])
      const height = heights[i]
      return {
        style: {
          backgroundColor: color.hex(),
          color: color.isDark() ? 'white' : 'black',
          height: `${80 + height}%`,
          textOrientation: 'sideways',
          writingMode: 'vertical-rl',
          flexGrow: book.pages || 270 // average,
        } satisfies CSSProperties,
        id: book.id,
        title: book.title
      }
    })
  }, [books])

  return (
    <div
      className={cn(className, 'relative flex h-full items-end')}
      style={{ width: books.length * 70 }}
    >
      {items.map((item) => (
        <div {...item} key={item.id} className="flex items-center py-8 text-20">
          {item.title}
        </div>
      ))}
    </div>
  )
}
