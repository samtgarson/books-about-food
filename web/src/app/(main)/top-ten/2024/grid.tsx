'use client'

import { Book as Model } from '@books-about-food/core/models/book'
import { BookVote } from '@books-about-food/database'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { AntiContainer } from 'src/components/atoms/container'
import { GridContainer } from 'src/components/lists/grid-container'
import { Search } from 'src/components/lists/search'
import { useNav } from 'src/components/nav/context'
import { TrackedLink } from 'src/components/tracking/context'
import { toggleItemAuto } from 'src/utils/array-helpers'
import { useLocalStorage } from 'usehooks-ts'
import { createVotes, onVote } from './actions'
import { TopTenGridItem } from './item'
import { TopTenSheet } from './sheet'
import sponsor from './sponsor.svg'

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
  async function toggle(book: Model) {
    const alreadySelected = selected.includes(book)
    if (!canVote && !alreadySelected) return
    const updated = toggleItemAuto(selected, book)
    setSelected(updated)
    if (!alreadySelected) await onVote(updated.map((book) => book.id))
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
        className="mb-6"
      />
      <AntiContainer className="bg-white flex flex-col items-center justify-center pt-6 pb-8 gap-2 border-t border-black sm:mb-6 md:mb-10 sm:border-none">
        <p className="all-caps opacity-40">Supported by</p>
        <TrackedLink
          href="https://themodestmerchant.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="Visit The Modest Merchant"
        >
          <Image
            src={sponsor}
            height={30}
            className="mobile-only:h-[18px]"
            alt="The Modest Merchant"
          />
        </TrackedLink>
      </AntiContainer>
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
