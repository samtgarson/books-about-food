'use client'

import { useState } from 'react'
import { Detail } from 'src/components/atoms/detail'
import { Edit2 } from 'src/components/atoms/icons'
import { Editor } from 'src/components/form/editor'
import { EditorRenderer } from 'src/components/form/editor/renderer'
import { useEditPublisher } from './context'

export function ContactInfo() {
  const { publisher, editMode, onSave } = useEditPublisher()
  const [value, setValue] = useState(publisher.contactInfo)

  if (editMode) {
    return (
      <Detail maxWidth className="relative">
        <Editor
          className="pr-5 min-h-14"
          value={publisher.contactInfo}
          onChange={setValue}
          onBlur={() => {
            if (value === publisher.contactInfo) return
            onSave({ contactInfo: value })
          }}
          placeholder="Add further information (e.g. a short description or contact info)"
        />
        <Edit2
          strokeWidth={1}
          size={24}
          className="absolute pointer-events-none top-4 right-0"
        />
      </Detail>
    )
  }

  if (publisher.contactInfo) {
    return (
      <Detail maxWidth>
        <EditorRenderer content={publisher.contactInfo} />
      </Detail>
    )
  }

  return null
}
