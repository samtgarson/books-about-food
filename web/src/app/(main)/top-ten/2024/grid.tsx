'use client'

import { Book as Model } from '@books-about-food/core/models/book'
import { useMemo, useState } from 'react'
import { GridContainer } from 'src/components/lists/grid-container'
import { Search } from 'src/components/lists/search'
import { toggleItemAuto } from 'src/utils/array-helpers'
import { useLocalStorage } from 'usehooks-ts'
import { TopTenGridItem } from './item'
import { TopTenSheet } from './sheet'

export function TopTenGrid({ books }: { books: Model[] }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useLocalStorage<Model[]>(
    'baf-top-ten-selection',
    [],
    {
      initializeWithValue: false,
      serializer(books) {
        return books.map((book) => book.id).join(',')
      },
      deserializer(ids) {
        return ids
          .split(',')
          .flatMap((id) => books.find((book) => book.id === id) ?? [])
      }
    }
  )
  const filteredBooks = useMemo(
    function () {
      function filterBooks(book: Model) {
        return (
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.authors.some((author) =>
            author.name.toLowerCase().includes(search.toLowerCase())
          )
        )
      }

      return books.filter(filterBooks)
    },
    [books, search]
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
          <TopTenGridItem
            key={book.id}
            book={book}
            disabled={!canVote && !isSelected(book)}
            selected={isSelected(book)}
            onClick={() => toggle(book)}
          />
        ))}
      </GridContainer>
    </>
  )
}
