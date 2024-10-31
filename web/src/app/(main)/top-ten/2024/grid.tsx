'use client'

import { Book as Model } from '@books-about-food/core/models/book'
import { BookVote } from '@books-about-food/database'
import { useMemo, useState } from 'react'
import { GridContainer } from 'src/components/lists/grid-container'
import { Search } from 'src/components/lists/search'
import { useNav } from 'src/components/nav/context'
import { toggleItemAuto } from 'src/utils/array-helpers'
import { useLocalStorage } from 'usehooks-ts'
import { createVotes } from './actions'
import { TopTenGridItem } from './item'
import { TopTenSheet } from './sheet'

export function TopTenGrid({
  books,
  existingVotes
}: {
  books: Model[]
  existingVotes: BookVote[]
  autoSubmit?: boolean
}) {
  const { footerVisible } = useNav()
  const existingVoteCount = existingVotes.length
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useLocalStorage<Model[]>(
    'baf-top-ten-selection',
    [],
    {
      initializeWithValue: false,
      serializer: (books) => books.map((book) => book.id).join(','),
      deserializer: (ids) =>
        ids
          .split(',')
          .flatMap((id) => books.find((book) => book.id === id) ?? [])
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

  const alreadyVoted = existingVoteCount >= 3
  const canVote = selected.length < 3
  function isSelected(book: Model) {
    return selected.includes(book)
  }
  function toggle(book: Model) {
    const isSelected = selected.includes(book)
    if (!canVote && !isSelected) return
    setSelected((a) => toggleItemAuto(a, book))
  }
  function submit() {
    return createVotes(selected.map((book) => book.id))
  }

  return (
    <>
      <TopTenSheet
        selected={selected}
        unselectBook={toggle}
        alreadyVoted={alreadyVoted}
        onSubmit={async function () {
          await submit()
        }}
        hidden={footerVisible || selected.length === 0}
      />
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
            disabled={alreadyVoted || (!canVote && !isSelected(book))}
            selected={isSelected(book)}
            onClick={() => toggle(book)}
          />
        ))}
      </GridContainer>
      {filteredBooks.length === 0 && (
        <p className="text-center w-full py-40">
          No books found. Try searching for something else.
        </p>
      )}
    </>
  )
}
