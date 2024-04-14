'use client'

import cn from 'classnames'
import { FC, useState } from 'react'
import { Button } from 'src/components/atoms/button'
import { Heart, Loader } from 'src/components/atoms/icons'
import { AuthedButton } from 'src/components/auth/authed-button'
import { useEditProfile } from 'src/components/profiles/edit/context'
import { successToast } from 'src/components/utils/toaster'
import { usePromise } from 'src/hooks/use-promise'
import { fetch, mutate } from './action'

export type FavouriteButtonProps = {
  profileId: string
  className?: string
}

export const FavouriteButton: FC<FavouriteButtonProps> = ({
  profileId,
  className
}) => {
  const { value, setValue, loading } = usePromise(
    () => fetch(profileId),
    null,
    [profileId]
  )
  const [updating, setUpdating] = useState(false)
  const { editMode, profile } = useEditProfile()
  const setFavourite = async (isFavourite: boolean) => {
    setUpdating(true)
    const newValue = await mutate(profileId, isFavourite)
    setValue(newValue)
    successToast(
      `Profile ${isFavourite ? 'added to' : 'removed from'} your favourites`
    )
    setUpdating(false)
  }

  if (editMode) return null
  return (
    <AuthedButton redirect={false} source="Favourite profile">
      <Button
        variant={profile.userId ? 'primary' : 'secondary'}
        onClick={() => setFavourite(!value)}
        className={cn(
          'flex items-center gap-2 transition-opacity mobile-only:bg-transparent',
          className,
          updating && 'opacity-50'
        )}
        disabled={loading || updating}
      >
        {loading ? (
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
