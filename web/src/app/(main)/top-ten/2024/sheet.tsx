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
        'z-sheet rounded-t-[16px] sm:rounded-2xl backdrop-blur-3xl fixed bottom-0 sm:bottom-6 left-0 right-0 sm:w-min bg-white/80 mx-auto book-shadow p-6 sm:p-8 flex gap-6 sm:gap-8 flex-col sm:flex-row sm:items-center overflow-hidden sm:h-[164px] transition',
        hidden && 'opacity-0 translate-y-8 pointer-events-none'
      )}
    >
      {alreadyVoted ? (
        <p className="text-center sm:text-left sm:w-72">
          <span className="font-medium block">Thank you for voting</span>
          The Top 10 with the most votes will be announced mid-December
        </p>
      ) : (
        <ul className={cn('sm:flex gap-3 relative flex justify-center')}>
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
        <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  )
}
