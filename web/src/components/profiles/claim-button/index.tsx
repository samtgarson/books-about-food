'use client'

import cn from 'classnames'
import { FC, useMemo } from 'react'
import { Loader } from 'src/components/atoms/icons'
import { usePromise } from 'src/hooks/use-promise'
import { Button } from '../../atoms/button'
import { useSheet } from '../../sheets/global-sheet'
import { useParamSheet } from '../../sheets/use-param-sheet'
import { useEditProfile } from '../edit/context'
import { EditProfileButton } from '../edit/edit-profile-button'
import { fetch } from './action'

export type ClaimProfileButtonProps = {
  className?: string
}

export const ClaimProfileButton: FC<ClaimProfileButtonProps> = ({
  className
}) => {
  const { openSheet } = useSheet()
  const { profile, enabled } = useEditProfile()
  const { loading, value: claim } = usePromise(() => fetch(profile.id), null, [
    profile.id
  ])
  const modalProps = useMemo(() => ({ profile }), [profile])
  useParamSheet('claimProfile', modalProps)

  if (enabled) {
    return <EditProfileButton className={className} />
  }
  if (profile.userId) return null
  return (
    <Button
      className={cn(
        'flex items-center gap-2 transition-opacity',
        className,
        loading && 'text-base/50'
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
