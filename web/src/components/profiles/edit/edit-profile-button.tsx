'use client'

import { Button } from 'src/components/atoms/button'
import { useEditProfile } from './context'
import { Check, Edit2 } from 'react-feather'

export function EditProfileButton({ className }: { className?: string }) {
  const { editMode, setEditMode } = useEditProfile()

  return (
    <Button onClick={() => setEditMode(!editMode)} className={className}>
      {editMode ? <Check strokeWidth={1} /> : <Edit2 strokeWidth={1} />}
      {editMode ? 'Finish Editing' : 'Edit Profile'}
    </Button>
  )
}
