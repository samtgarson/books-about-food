'use client'

import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { EditorContent } from '@tiptap/react'
import cn from 'classnames'
import { useState } from 'react'
import { Loader } from 'src/components/atoms/loader'
import {
  createExtensions,
  createImageUploader,
  htmlClasses,
  useEditor
} from 'src/lib/editor'
import { upload } from '../image-upload/action'
import { EditorMenu } from './menu'
import './styles.css'

export type EditorProps = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  className?: string
  imagePrefix?: string
  id?: string
}

export function Editor({
  placeholder = 'Write something...',
  value,
  onChange,
  onBlur,
  className,
  imagePrefix,
  id
}: EditorProps) {
  const [wrapper, setWrapper] = useState<HTMLElement | null>(null)
  const [loading, setLoading] = useState(false)

  // Create image uploader extension if imagePrefix is provided
  const imageUploader = imagePrefix
    ? createImageUploader(async (file) => {
        const fd = new FormData()
        fd.append('image', file, file.name)
        const { data: [result] = [] } = await upload(imagePrefix, fd)
        if (!result.filename) return null
        return imageUrl(result.filename, result.prefix)
      }, setLoading)
    : undefined

  const editor = useEditor({
    value,
    onChange,
    onBlur: (event) => {
      if (!wrapper?.contains(event.relatedTarget as Node)) onBlur?.()
    },
    editable: !loading,
    extensions: createExtensions({ placeholder }, imageUploader),
    editorProps: {
      attributes: {
        class: cn(className, 'bg-white', htmlClasses)
      }
    }
  })

  return (
    <div
      ref={setWrapper}
      className={cn('relative transition-opacity', loading && 'opacity-50')}
    >
      <EditorMenu editor={editor} container={wrapper || undefined} />
      <EditorContent id={id} editor={editor} />
      {loading && (
        <Loader className="absolute inset-x-0 top-1/2 mx-auto -mt-3" />
      )}
    </div>
  )
}
