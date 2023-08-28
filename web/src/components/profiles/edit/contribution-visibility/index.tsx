'use client'

import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import { useEditProfile } from '../context'
import { Skeleton } from 'src/components/books/item'
import { Eye, EyeOff } from 'react-feather'
import cn from 'classnames'
import { action, fetch } from './action'

type ContributionVisibilityProps = {
  bookId: string
  children: ReactNode
}

export const ContributionVisibility: FC<ContributionVisibilityProps> = ({
  bookId,
  children
}) => {
  const { editMode, profile } = useEditProfile()
  const [loading, setLoading] = useState(false)
  const [hidden, setHidden] = useState(true)

  const fetchContributions = useCallback(async () => {
    const c = await fetch({ profileId: profile.id, bookId })
    setHidden(c[0]?.hidden ?? true)
    setLoading(false)
  }, [profile.id, bookId])

  const toggle = useCallback(async () => {
    await action({ profileId: profile.id, bookId, hidden: !hidden })
    setHidden(!hidden)
  }, [profile.id, bookId, hidden])

  useEffect(() => {
    setLoading(true)
    fetchContributions()
  }, [fetchContributions])

  if (loading) return <Skeleton />
  if (hidden && !editMode) return null
  if (!editMode) return <>{children}</>
  return (
    <div className={cn('relative')}>
      <div
        className={cn('opacity-80 transition', {
          'opacity-50 saturate-0': hidden
        })}
      >
        {children}
      </div>
      <button
        className="absolute inset-x-0 top-0 aspect-square flex items-center justify-center"
        title={hidden ? 'Show this book' : 'Hide this book'}
        onClick={toggle}
      >
        <div className="w-10 h-10 bg-white flex items-center justify-center">
          {hidden ? <EyeOff strokeWidth={1} /> : <Eye strokeWidth={1} />}
        </div>
      </button>
    </div>
  )
}
