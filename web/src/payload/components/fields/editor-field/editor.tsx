'use client'

import { EditorContent } from '@tiptap/react'
import { createExtensions, htmlClasses, useEditor } from 'src/lib/editor'
import { EditorMenu } from './menu'

export type PayloadEditorProps = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function PayloadEditor({
  value,
  onChange,
  placeholder = 'Write something...',
  className,
  disabled
}: PayloadEditorProps) {
  const editor = useEditor({
    value,
    onChange,
    editable: !disabled,
    extensions: createExtensions({ placeholder }),
    editorProps: {
      attributes: {
        class: `tiptap ${htmlClasses} ${className || ''}`
      }
    }
  })

  return (
    <div className={`editor-wrapper`}>
      <EditorMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
