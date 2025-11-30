'use client'

import { Book as Model } from '@books-about-food/core/models/book'
import cn from 'classnames'
import { useState } from 'react'
import { Button } from 'src/components/atoms/button'
import { Loader } from 'src/components/atoms/loader'
import { AuthedButton } from 'src/components/auth/authed-button'
import { range } from 'src/utils/array-helpers'
import { TopTenSheetItem } from './sheet-item'

type TopTenSheetProps = {
  selected: Model[]
  unselectBook: (book: Model) => void
  alreadyVoted?: boolean
  onSubmit: () => Promise<void>
  loading?: boolean
  hidden?: boolean
}

export function TopTenSheet({
  selected,
  unselectBook,
  alreadyVoted,
  onSubmit,
  loading,
  hidden
}: TopTenSheetProps) {
  const [submitting, setSubmitting] = useState(false)
  const submitDisabled = selected.length < 3
  const submitLabel =
    selected.length === 3
      ? 'Submit'
      : `${3 - selected.length} ${
          selected.length === 2 ? 'vote' : 'votes'
        } remaining`

  return (
    <div
      className={cn(
        'fixed right-0 bottom-0 left-0 z-sheet mx-auto flex flex-col gap-6 overflow-hidden rounded-t-[16px] bg-white/80 p-6 book-shadow backdrop-blur-3xl transition sm:bottom-6 sm:h-[164px] sm:w-min sm:flex-row sm:items-center sm:gap-8 sm:rounded-2xl sm:p-8',
        hidden && 'pointer-events-none translate-y-8 opacity-0'
      )}
    >
      {alreadyVoted ? (
        <p className="text-center sm:w-72 sm:text-left">
          <span className="block font-medium">Thank you for voting</span>
          The Top 10 with the most votes will be announced mid-December
        </p>
      ) : (
        <ul className={cn('relative flex justify-center gap-3 sm:flex')}>
          {range(3).map((_, i) => (
            <TopTenSheetItem
              key={i}
              onDeselect={() => unselectBook(selected[i])}
              book={selected[i]}
            />
          ))}
        </ul>
      )}
      {alreadyVoted ? (
        <Button href="/" variant="outline">
          Go to Homepage
        </Button>
      ) : (
        <AuthedButton
          source="top-ten-2024"
          title="Login or Create an Account to Vote"
          description="All votes will be added up and the Top 10 books with the most votes will be announced mid-December 2024."
        >
          <Button
            disabled={submitDisabled}
            variant={submitDisabled ? 'tertiary' : 'dark'}
            className="sm:w-44"
            onClick={async function () {
              setSubmitting(true)
              await onSubmit()
            }}
            loading={submitting}
          >
            {submitLabel}
          </Button>
        </AuthedButton>
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-3xl">
          <Loader />
        </div>
      )}
    </div>
  )
}
