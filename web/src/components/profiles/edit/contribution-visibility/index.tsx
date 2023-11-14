'use client'

import { Book } from '@books-about-food/core/models/book'
import cn from 'classnames'
import { FC, useCallback, useMemo, useState } from 'react'
import { Eye, EyeOff } from 'react-feather'
import { Loader } from 'src/components/atoms/loader'
import { Container, Cover, Footer } from 'src/components/books/item'
import { useListDisplay } from 'src/components/lists/list-context'
import { useEditProfile } from '../context'
import { action } from './action'

type ContributionVisibilityProps = {
  book: Book
  hidden: boolean
  mobileGrid?: boolean
}

export const ContributionVisibility: FC<ContributionVisibilityProps> = ({
  book,
  hidden: initialHidden
}) => {
  const [hidden, setHidden] = useState<boolean>(initialHidden)
  const { editMode, profile } = useEditProfile()
  const bookId = useMemo(() => book.id, [book.id])
  const [loading, setLoading] = useState(false)
  const { display } = useListDisplay()

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
    <Container book={book} link={!editMode}>
      <Cover
        attrs={book.cover?.imageAttrs(200)}
        className={cn(
          'transition',
          editMode && hidden && 'opacity-30 saturate-0'
        )}
      />
      {display === 'list' && (
        <Footer
          className={cn('transition', hidden ? 'opacity-30' : 'opacity-80')}
        >
          <p className="text-16 mb-1 font-medium">{book.title}</p>
          <p className="text-14">{book.authorNames}</p>
        </Footer>
      )}
      {editMode && (
        <button
          className="absolute inset-x-0 bottom-0 top-0 z-20 flex items-center justify-center sm:bottom-auto sm:aspect-square"
          title={
            hidden
              ? `Show ${book.title} on your public profile`
              : `Hide ${book.title} on your public profile`
          }
          onClick={() => updateVisibility(!hidden)}
        >
          <div className="flex h-10 w-10 items-center justify-center bg-white">
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
