'use client'

import { Bold } from '@tiptap/extension-bold'
import { Document } from '@tiptap/extension-document'
import { Dropcursor } from '@tiptap/extension-dropcursor'
import { History } from '@tiptap/extension-history'
import { Italic } from '@tiptap/extension-italic'
import { Link } from '@tiptap/extension-link'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Text } from '@tiptap/extension-text'
import { Typography } from '@tiptap/extension-typography'
import { Underline } from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import cn from 'classnames'
import { useState } from 'react'
import { Loader } from 'src/components/atoms/loader'
import { ImageUploader } from './file-handler'
import { EditorMenu } from './menu'
import './styles.css'
import { htmlClasses } from './util'

export type EditorProps = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  className?: string
  imagePrefix?: string
}

export function Editor({
  placeholder = 'Write something...',
  value,
  onChange,
  onBlur,
  className,
  imagePrefix
}: EditorProps) {
  const [wrapper, setWrapper] = useState<HTMLElement | null>(null)
  const [loading, setLoading] = useState(false)
  const editor = useEditor({
    immediatelyRender: false,
    extensions: extensions({ placeholder, setLoading, imagePrefix }),
    content: value,
    editable: !loading,
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
      if (!wrapper?.contains(event.relatedTarget as Node)) onBlur?.()
    }
  })

  return (
    <div
      ref={setWrapper}
      className={cn('relative transition-opacity', loading && 'opacity-50')}
    >
      <EditorMenu editor={editor} container={wrapper || undefined} />
      <EditorContent editor={editor} />
      {loading && (
        <Loader className="absolute inset-x-0 top-1/2 mx-auto -mt-3" />
      )}
    </div>
  )
}

function extensions({
  placeholder,
  setLoading,
  imagePrefix
}: Pick<EditorProps, 'placeholder' | 'imagePrefix'> & {
  setLoading: (loading: boolean) => void
}) {
  const arr = [
    Bold,
    Document,
    Dropcursor,
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
  ]
  if (imagePrefix) {
    arr.push(ImageUploader(setLoading, imagePrefix))
  }

  return arr
}
