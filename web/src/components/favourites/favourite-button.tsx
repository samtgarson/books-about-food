'use client'

import { FC } from 'react'
import { Heart, Loader } from 'react-feather'
import { useFetcher } from 'src/contexts/fetcher'
import cn from 'classnames'
import { Button } from '../atoms/button'
import { SignInButton } from '../auth/sign-in-button'

export type FavouriteButtonProps = {
  profileId: string
  className?: string
}

export const FavouriteButton: FC<FavouriteButtonProps> = ({
  profileId,
  className
}) => {
  const { data, mutate, isValidating, isLoading } = useFetcher('favourite', {
    profileId
  })
  const value = !!data
  const setFavourite = (isFavourite: boolean) =>
    mutate({ profileId, isFavourite })

  return (
    <SignInButton redirect={false}>
      <Button
        variant="secondary"
        onClick={() => setFavourite(!value)}
        className={cn('flex gap-2 items-center transition-opacity', className, {
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
    </SignInButton>
  )
}
