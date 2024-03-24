'use client'

import { useState } from 'react'
import { Detail } from 'src/components/atoms/detail'
import { Editor } from 'src/components/form/editor'
import { htmlClasses } from 'src/components/form/editor/util'
import { useEditPublisher } from './context'

export function ContactInfo() {
  const { publisher, editMode, onSave } = useEditPublisher()
  const [value, setValue] = useState(publisher.contactInfo)

  if (editMode) {
    return (
      <Detail maxWidth>
        <Editor
          value={publisher.contactInfo}
          onChange={setValue}
          onBlur={() => {
            if (value === publisher.contactInfo) return
            onSave({ contactInfo: value })
          }}
          placeholder="Add contact info"
        />
      </Detail>
    )
  }

  if (publisher.contactInfo) {
    return (
      <Detail maxWidth>
        <div
          className={htmlClasses}
          dangerouslySetInnerHTML={{ __html: publisher.contactInfo }}
        ></div>
      </Detail>
    )
  }

  return null
}
