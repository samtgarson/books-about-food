'use client'

import { FieldLabel, useField } from '@payloadcms/ui'
import cn from 'classnames'
import type { UploadFieldClientProps } from 'payload'
import { useEffect, useRef, useState } from 'react'
import { ImageUploadCore } from 'src/components/form/image-upload/core'
import { Image } from 'src/core/models/image'
import styles from '../image-field.module.css'
import { loadImages } from '../load-images'

type CoverValue = string | { id: string } | null | undefined

function coverImageId(value: CoverValue): string | undefined {
  if (!value) return undefined
  return typeof value === 'string' ? value : value.id
}

/**
 * Renders Payload's single `coverImage` upload field with the same
 * `ImageUploadCore` gallery the frontend `/edit` cover input uses. Unlike the
 * array-backed preview field, the value here is a single image id, so it syncs
 * through `useField().setValue` and Payload's native Save persists it.
 */
export function CoverImageField({ path, field }: UploadFieldClientProps) {
  const { value, setValue } = useField<CoverValue>({ path })
  const [images, setImages] = useState<Image[]>([])
  const loaded = useRef(false)

  // Seed from the image already stored on the document, once form state is ready.
  useEffect(() => {
    if (loaded.current || value === undefined) return
    loaded.current = true

    const id = coverImageId(value)
    if (!id) return

    async function seed(imageId: string) {
      const [doc] = await loadImages([imageId])
      if (doc) setImages([new Image(doc, doc.filename ?? '')])
    }

    void seed(id)
  }, [value, path])

  return (
    <div className="field-type">
      <FieldLabel label={field.label} path={path} />
      <ImageUploadCore
        images={images}
        prefix="books/cover"
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
