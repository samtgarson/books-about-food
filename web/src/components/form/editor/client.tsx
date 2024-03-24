'use client'

import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import History from '@tiptap/extension-history'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import cn from 'classnames'
import { useRef } from 'react'
import { EditorMenu } from './menu'
import './styles.css'
import { htmlClasses } from './util'

export type EditorProps = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  className?: string
}

export function Editor({
  placeholder = 'Write something...',
  value,
  onChange,
  onBlur,
  className
}: EditorProps) {
  const menu = useRef<HTMLDivElement>(null)
  const editor = useEditor({
    extensions: [
      Bold,
      Document,
      History,
      Italic,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer nofollow',
          target: '_blank'
        }
      }),
      Paragraph,
      Placeholder.configure({
        placeholder
      }),
      Text,
      Typography,
      Underline
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(className, 'bg-white', htmlClasses)
      }
    },
    onUpdate({ editor }) {
      const html = editor
        .getHTML()
        .replace(/(^(<p><\/p>)+)|((<p><\/p>)+$)/g, '')
      onChange?.(html)
    },
    onBlur({ event }) {
      if (!menu.current?.contains(event.relatedTarget as Node))
        return onBlur?.()
    }
  })

  return (
    <div>
      <EditorMenu editor={editor} ref={menu} />
      <EditorContent editor={editor} />
    </div>
  )
}
