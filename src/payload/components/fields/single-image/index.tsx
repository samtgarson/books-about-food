'use client'

import { FieldLabel, useField } from '@payloadcms/ui'
import cn from 'classnames'
import type { UploadFieldClientProps } from 'payload'
import { useEffect, useRef, useState } from 'react'
import { ImageUploadCore } from 'src/components/form/image-upload/core'
import { Image } from 'src/core/models/image'
import styles from '../image-field.module.css'
import { loadImages } from '../load-images'

type ImageValue = string | { id: string } | null | undefined

type SingleImageFieldProps = UploadFieldClientProps & {
  prefix: string
}

function imageId(value: ImageValue): string | undefined {
  if (!value) return undefined
  return typeof value === 'string' ? value : value.id
}

/**
 * Renders a single-image Payload upload field (e.g. a book's `coverImage` or a
 * profile's `avatar`) with the same `ImageUploadCore` gallery the frontend
 * uses. The value is a single image id, so it syncs through
 * `useField().setValue` and Payload's native Save persists it. Pass the upload
 * storage `prefix` via the field's `clientProps`.
 */
export function SingleImageField({
  path,
  field,
  prefix
}: SingleImageFieldProps) {
  const { value, setValue } = useField<ImageValue>({ path })
  const [images, setImages] = useState<Image[]>([])
  const loaded = useRef(false)

  // Seed from the image already stored on the document, once form state is ready.
  useEffect(() => {
    if (loaded.current || value === undefined) return
    loaded.current = true

    const id = imageId(value)
    if (!id) return

    async function seed(id: string) {
      const [doc] = await loadImages([id])
      if (doc) setImages([new Image(doc, doc.filename ?? '')])
    }

    void seed(id)
  }, [value, path])

  return (
    <div className="field-type">
      <FieldLabel label={field.label} path={path} />
      <ImageUploadCore
        images={images}
        prefix={prefix}
        className={cn('upload-field-card', styles.gutter)}
        onUpload={(uploaded) => {
          const image = uploaded[uploaded.length - 1]
          if (!image) return
          setImages([image])
          setValue(image.id)
        }}
        onDelete={() => {
          setImages([])
          setValue(null)
        }}
        onReorder={() => {}}
      />
    </div>
  )
}
