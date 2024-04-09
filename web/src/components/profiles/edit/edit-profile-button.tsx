'use client'

import cn from 'classnames'
import { Button } from 'src/components/atoms/button'
import { Check, Edit2 } from 'src/components/atoms/icons'
import { useEditProfile } from './context'

export function EditProfileButton({ className }: { className?: string }) {
  const { editMode, setEditMode, profile } = useEditProfile()

  return (
    <Button
      onClick={() => setEditMode(!editMode)}
      className={cn(className)}
      variant={editMode || !profile.userId ? 'primary' : 'secondary'}
    >
      {editMode ? <Check strokeWidth={1} /> : <Edit2 strokeWidth={1} />}
      {editMode ? 'Finish Editing' : 'Edit Profile'}
    </Button>
  )
}
