'use client'

import cn from 'classnames'
import { useState } from 'react'
import { Edit2 } from 'src/components/atoms/icons'
import { Editor } from 'src/components/form/editor'
import { EditorRenderer } from 'src/components/form/editor/renderer'
import { useEditPublisher } from './context'

const classes = 'text-20 sm:text-32'

export function Description({ className }: { className?: string }) {
  const { publisher, editMode, onSave } = useEditPublisher()
  const [value, setValue] = useState(publisher.description)

  if (editMode) {
    return (
      <div className={cn('relative', className)}>
        <Editor
          className={cn('min-h-14 pr-5', classes)}
          value={publisher.description}
          onChange={setValue}
          onBlur={() => {
            if (value === publisher.description) return
            onSave({ description: value })
          }}
          placeholder="Add further information (e.g. a short description or contact info)"
        />
        <Edit2
          strokeWidth={1}
          size={24}
          className="pointer-events-none absolute right-0 top-4"
        />
      </div>
    )
  }

  if (publisher.description) {
    return (
      <EditorRenderer
        className={cn(classes, className)}
        content={publisher.description}
      />
    )
  }

  return null
}
