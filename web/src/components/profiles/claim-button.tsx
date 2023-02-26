'use client'

import cn from 'classnames'
import { FC } from 'react'
import { Loader } from 'react-feather'
import { Profile } from 'src/models/profile'
import { Button } from '../atoms/button'
import { useParamSheet, useSheet } from '../sheets/global-sheet'

export type ClaimProfileButtonProps = {
  profile: Profile
  className?: string
}

export const ClaimProfileButton: FC<ClaimProfileButtonProps> = ({
  className,
  profile
}) => {
  const { openSheet } = useSheet()
  useParamSheet('claim', 'claimProfile', { profile })

  return (
    <Button
      className={cn('flex gap-2 items-center transition-opacity', className)}
      onClick={() => openSheet('claimProfile', { profile })}
    >
      <Loader strokeWidth={1} />
      Claim Profile
    </Button>
  )
}
