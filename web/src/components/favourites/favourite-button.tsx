'use client'

import cn from 'classnames'
import { FC } from 'react'
import { Heart, Loader } from 'react-feather'
import { useFetcher } from 'src/contexts/fetcher'
import { Button } from '../atoms/button'
import { AuthedButton } from '../auth/authed-button'
import { useEditProfile } from '../profiles/edit/context'

export type FavouriteButtonProps = {
  profileId: string
  className?: string
}

export const FavouriteButton: FC<FavouriteButtonProps> = ({
  profileId,
  className
}) => {
  const { data, mutate, isValidating, isLoading } = useFetcher(
    'favourite',
    { profileId },
    { authorized: true }
  )
  const value = !!data
  const { editMode } = useEditProfile()
  const setFavourite = (isFavourite: boolean) =>
    mutate({ profileId, isFavourite })

  if (editMode) return null
  return (
    <AuthedButton redirect={false}>
      <Button
        variant="secondary"
        onClick={() => setFavourite(!value)}
        className={cn('flex items-center gap-2 transition-opacity', className, {
          'opacity-50': isValidating
        })}
      >
        {isLoading ? (
          <>
            <Loader className="animate-spin" strokeWidth={1} />
            <span className="sr-only md:not-sr-only">Loading</span>
          </>
        ) : value ? (
          <>
            <Heart className="fill-black" />
            <span className="sr-only md:not-sr-only">
              Remove from Favourites
            </span>
          </>
        ) : (
          <>
            <Heart strokeWidth={1} />
            <span className="sr-only md:not-sr-only">Add to Favourites</span>
          </>
        )}
      </Button>
    </AuthedButton>
  )
}
