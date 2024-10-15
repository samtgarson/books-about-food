'use client'

import { Book as Model } from '@books-about-food/core/models/book'
import cn from 'classnames'
import { useState } from 'react'
import * as Book from 'src/components/books/item'
import { GridContainer } from 'src/components/lists/grid-container'
import { Search } from 'src/components/lists/search'
import { toggleItemAuto } from 'src/utils/array-helpers'
import { TopTenSheet } from './sheet'

export function TopTenGrid({ books }: { books: Model[] }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Model[]>([])
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.authors.some((author) =>
        author.name.toLowerCase().includes(search.toLowerCase())
      )
  )

  const canVote = selected.length < 3
  function isSelected(book: Model) {
    return selected.includes(book)
  }
  function toggle(book: Model) {
    const isSelected = selected.includes(book)
    if (!canVote && !isSelected) return
    setSelected((a) => toggleItemAuto(a, book))
  }

  return (
    <>
      <TopTenSheet selected={selected} unselectBook={toggle} />
      <Search
        value={search}
        onChange={setSearch}
        debounceDelay={100}
        className="mb-6 md:mb-10"
      />
      <GridContainer className={'sm:gap-y-16'}>
        {filteredBooks.map((book) => (
          <Book.Container
            key={book.id}
            book={book}
            centered
            link={false}
            onClick={() => toggle(book)}
            disabled={!canVote && !isSelected(book)}
          >
            <div
              className={cn(
                'absolute inset-0 sm:inset-[-18px] bg-black z-[-1] transition  ease-out',
                isSelected(book) || 'opacity-0 sm:scale-[0.97]'
              )}
            />
            <Book.Cover book={book} colorful={isSelected(book)} />
            <Book.Footer
              book={book}
              className={cn(
                'sm:text-center transition-colors ease-out !sm:px-6',
                isSelected(book) && 'text-white'
              )}
            />
          </Book.Container>
        ))}
      </GridContainer>
    </>
  )
}
