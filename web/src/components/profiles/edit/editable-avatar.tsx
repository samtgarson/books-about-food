'use client'

import { Avatar } from 'src/components/atoms/avatar'
import { useEditProfile } from './context'
import { Edit2, Trash2 } from 'react-feather'
import { ImageUploadButton } from 'src/components/form/image-upload/upload-button'

export const EditableAvatar = () => {
  const { editMode, profile, onSave } = useEditProfile()

  return (
    <div className="relative pr-5">
      <Avatar profile={profile} size="xl" mobileSize="md" />
      {editMode && (
        <div className="absolute right-0 top-0 flex gap-1">
          <ImageUploadButton
            prefix="profile-avatars"
            className="flex h-10 w-10 items-center justify-center bg-white"
            onSuccess={([{ id }]) => onSave({ avatar: id })}
          >
            <Edit2 strokeWidth={1} size={24} />
          </ImageUploadButton>
          <button
            className="flex h-10 w-10 items-center justify-center bg-white"
            onClick={() => onSave({ avatar: null })}
          >
            <Trash2 strokeWidth={1} size={24} />
          </button>
        </div>
      )}
    </div>
  )
}
