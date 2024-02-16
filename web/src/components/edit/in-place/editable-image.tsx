import { ReactNode } from 'react'
import { Edit2, Trash2 } from 'src/components/atoms/icons'
import { ImageUploadButton } from 'src/components/form/image-upload/upload-button'

export type EditableImageProps = {
  editMode: boolean
  children: ReactNode
  onSave: (id: string | null) => void
  croppeable?: boolean
  label?: string
}

export function EditableImage({
  editMode,
  children,
  onSave,
  croppeable = false,
  label
}: EditableImageProps) {
  return (
    <div className="relative pr-5">
      {children}
      {editMode && (
        <div className="absolute right-0 top-0 flex gap-1">
          <ImageUploadButton
            croppable={croppeable}
            name="avatar"
            prefix="profile-avatars"
            className="flex text-16 h-10 min-w-10 px-2 items-center justify-center bg-white gap-2"
            onSuccess={([{ id }]) => onSave(id)}
          >
            <Edit2 strokeWidth={1} size={24} />
            {label}
          </ImageUploadButton>
          <button
            className="flex h-10 w-10 items-center justify-center bg-white"
            onClick={() => onSave(null)}
          >
            <Trash2 strokeWidth={1} size={24} />
          </button>
        </div>
      )}
    </div>
  )
}
