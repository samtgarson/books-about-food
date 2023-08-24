'use client'

import cn from 'classnames'
import { FC } from 'react'
import { Loader } from 'react-feather'
import { useFetcher } from 'src/contexts/fetcher'
import { Profile } from 'src/models/profile'
import { Button } from '../atoms/button'
import { useParamSheet, useSheet } from '../sheets/global-sheet'
import { EditProfileButton } from './edit/edit-profile-button'
import { useCurrentUser } from 'src/hooks/use-current-user'

export type ClaimProfileButtonProps = {
  profile: Profile
  className?: string
}

export const ClaimProfileButton: FC<ClaimProfileButtonProps> = ({
  className,
  profile
}) => {
  const { openSheet } = useSheet()
  const { isLoading, data: claim } = useFetcher(
    'claim',
    { profileId: profile.id },
    { authorized: true }
  )
  useParamSheet('claim', 'claimProfile', { profile })
  const currentUser = useCurrentUser()

  if (profile.userId === currentUser?.id || currentUser?.role === 'admin')
    return <EditProfileButton className={className} />
  return (
    <Button
      className={cn(
        'flex gap-2 items-center transition-opacity',
        className,
        isLoading && 'text-opacity-50'
      )}
      onClick={() => openSheet('claimProfile', { profile })}
      title={claim ? 'View instructions' : 'Claim this profile'}
    >
      <Loader
        strokeWidth={1}
        className={cn({
          'animate-spin': isLoading
        })}
      />
      {isLoading ? 'Loading' : claim ? 'Claim in progress' : 'Claim Profile'}
    </Button>
  )
}
