'use client'

import cn from 'classnames'
import { FC, useCallback, useMemo, useState } from 'react'
import { Eye, EyeOff } from 'react-feather'
import { Container, Cover, Footer } from 'src/components/books/item'
import { Book } from 'src/models/book'
import { useEditProfile } from '../context'
import { action } from './action'
import { Loader } from 'src/components/atoms/loader'

type ContributionVisibilityProps = {
  book: Book
  hidden: boolean
}

export const ContributionVisibility: FC<ContributionVisibilityProps> = ({
  book,
  hidden: initialHidden
}) => {
  const [hidden, setHidden] = useState<boolean>(initialHidden)
  const { editMode, profile } = useEditProfile()
  const bookId = useMemo(() => book.id, [book.id])
  const [loading, setLoading] = useState(false)

  const updateVisibility = useCallback(
    async (newValue: boolean) => {
      setLoading(true)
      await action({ profileId: profile.id, bookId, hidden: newValue })
      setHidden(newValue)
      setLoading(false)
    },
    [profile.id, bookId]
  )

  if (hidden && !editMode) return null
  return (
    <Container book={book}>
      <Cover
        book={book}
        className={cn(
          'transition',
          hidden ? 'opacity-30 saturate-0' : 'opacity-80'
        )}
      />
      <Footer
        className={cn('transition', hidden ? 'opacity-30' : 'opacity-80')}
      >
        <p className="font-medium text-16 mb-1">{book.title}</p>
        <p className="text-14">{book.authorNames}</p>
      </Footer>
      {editMode && (
        <button
          className="absolute inset-x-0 top-0 bottom-0 sm:bottom-auto sm:aspect-square flex items-center justify-center z-20"
          title={hidden ? 'Show this book' : 'Hide this book'}
          onClick={() => updateVisibility(!hidden)}
        >
          <div className="w-10 h-10 bg-white flex items-center justify-center">
            {loading ? (
              <Loader />
            ) : hidden ? (
              <EyeOff strokeWidth={1} />
            ) : (
              <Eye strokeWidth={1} />
            )}
          </div>
        </button>
      )}
    </Container>
  )
}
