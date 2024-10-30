'use client'

import { Book as Model } from '@books-about-food/core/models/book'
import { useEffect, useMemo, useState } from 'react'
import { GridContainer } from 'src/components/lists/grid-container'
import { Search } from 'src/components/lists/search'
import { usePromise } from 'src/hooks/use-promise'
import { toggleItemAuto } from 'src/utils/array-helpers'
import { useLocalStorage } from 'usehooks-ts'
import { createVotes, fetchVotes } from './actions'
import { TopTenGridItem } from './item'
import { TopTenSheet } from './sheet'

export function TopTenGrid({ books }: { books: Model[] }) {
  const {
    value: existingVotes,
    loading: voteCountLoading,
    revalidate
  } = usePromise(fetchVotes, [])
  const existingVoteCount = existingVotes.length
  const [search, setSearch] = useState('')
  const [selected, setSelected, removeSelected] = useLocalStorage<Model[]>(
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

  useEffect(() => {
    if (existingVotes.length <= 0) return
    const votedBooks = existingVotes.flatMap(
      (vote) => books.find((book) => book.id === vote.bookId) ?? []
    )
    setSelected(votedBooks)
  }, [existingVotes])

  return (
    <>
      <TopTenSheet
        selected={selected}
        unselectBook={toggle}
        alreadyVoted={alreadyVoted}
        onSubmit={async function () {
          await createVotes(selected.map((book) => book.id))
          removeSelected()
          revalidate()
        }}
        loading={voteCountLoading}
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
    </>
  )
}
