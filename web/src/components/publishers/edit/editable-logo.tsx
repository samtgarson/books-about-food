'use client'

import Image from 'next/image'
import { EditableImage } from 'src/components/edit/in-place/editable-image'
import { useEditPublisher } from './context'

export function EditableLogo() {
  const { editMode, publisher, onSave } = useEditPublisher()

  return (
    <EditableImage
      editMode={editMode}
      onSave={(logo) => onSave({ logo })}
      label={publisher.logo ? undefined : 'Add Logo'}
    >
      {publisher.logo ? (
        <Image
          {...publisher.logo.imageAttrs(80)}
          className="h-[80px] w-[150px] object-contain object-left mix-blend-darken"
        />
      ) : (
        publisher.name
      )}
    </EditableImage>
  )
}
