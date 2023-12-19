'use client'

import { Profile } from '@books-about-food/core/models/profile'
import cn from 'classnames'
import { FC, useMemo } from 'react'
import { Loader } from 'src/components/atoms/icons'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { usePromise } from 'src/hooks/use-promise'
import { Button } from '../../atoms/button'
import { useSheet } from '../../sheets/global-sheet'
import { useParamSheet } from '../../sheets/use-param-sheet'
import { EditProfileButton } from '../edit/edit-profile-button'
import { fetch } from './action'

export type ClaimProfileButtonProps = {
  profile: Profile
  className?: string
}

export const ClaimProfileButton: FC<ClaimProfileButtonProps> = ({
  className,
  profile
}) => {
  const { openSheet } = useSheet()
  const { loading, value: claim } = usePromise(() => fetch(profile.id), null, [
    profile.id
  ])
  const modalProps = useMemo(() => ({ profile }), [profile])
  useParamSheet('claimProfile', modalProps)
  const currentUser = useCurrentUser()

  if (
    (profile.userId && profile.userId === currentUser?.id) ||
    currentUser?.role === 'admin'
  ) {
    return <EditProfileButton className={className} />
  }
  if (profile.userId) return null
  return (
    <Button
      className={cn(
        'flex items-center gap-2 transition-opacity',
        className,
        loading && 'text-opacity-50'
      )}
      onClick={() => openSheet('claimProfile', modalProps)}
      title={claim ? 'View instructions' : 'Claim this profile'}
    >
      <Loader
        strokeWidth={1}
        className={cn({
          'animate-spin': loading
        })}
      />
      {loading ? 'Loading' : claim ? 'Claim in progress' : 'Claim Profile'}
    </Button>
  )
}
