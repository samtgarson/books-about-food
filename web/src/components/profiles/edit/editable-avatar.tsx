'use client'

import { Avatar } from 'src/components/atoms/avatar'
import { EditableImage } from 'src/components/edit/in-place/editable-image'
import { useEditProfile } from './context'

export const EditableAvatar = () => {
  const { editMode, profile, onSave } = useEditProfile()

  return (
    <EditableImage
      editMode={editMode}
      onSave={(avatar) => onSave({ avatar })}
      croppeable
    >
      <Avatar profile={profile} size="xl" mobileSize="md" />
    </EditableImage>
  )
}
