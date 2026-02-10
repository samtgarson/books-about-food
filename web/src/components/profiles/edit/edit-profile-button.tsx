'use client'

import cn from 'classnames'
import { Button } from 'src/components/atoms/button'
import { Check, Edit2 } from 'src/components/atoms/icons'
import { useNav } from 'src/components/nav/context'
import { useEditProfile } from './context'

export function EditProfileButton({ className }: { className?: string }) {
  const { editMode, profile, loading } = useEditProfile()
  const href = editMode
    ? `/people/${profile.slug}`
    : `/people/${profile.slug}/edit`
  const { internalLoading } = useNav()

  return (
    <Button
      href={href}
      scroll={false}
      replace
      className={cn(className)}
      loading={loading || internalLoading}
      variant={editMode || !profile.userId ? 'primary' : 'secondary'}
    >
      {editMode ? <Check strokeWidth={1} /> : <Edit2 strokeWidth={1} />}
      {editMode ? 'Finish Editing' : 'Edit Profile'}
    </Button>
  )
}
