'use client'

import { FC } from 'react'
import { Heart } from 'react-feather'
import { useFetcher } from 'src/contexts/fetcher'
import cn from 'classnames'
import { Button } from '../atoms/button'

export type FavouriteButtonProps = {
  profileId: string
  className?: string
}

export const FavouriteButton: FC<FavouriteButtonProps> = ({
  profileId,
  className
}) => {
  const { data, mutate, isValidating } = useFetcher('favourite', { profileId })
  const value = !!data
  const setFavourite = (isFavourite: boolean) =>
    mutate({ profileId, isFavourite })

  return (
    <Button
      variant="secondary"
      onClick={() => setFavourite(!value)}
      className={cn('flex gap-2 items-center transition-opacity', className, {
        'opacity-50 pointer-events-none': isValidating
      })}
    >
      {value ? (
        <>
          <Heart className="fill-black" />
          <span className="sr-only md:not-sr-only">Remove from Favourites</span>
        </>
      ) : (
        <>
          <Heart strokeWidth={1} />
          <span className="sr-only md:not-sr-only">Add to Favourites</span>
        </>
      )}
    </Button>
  )
}
