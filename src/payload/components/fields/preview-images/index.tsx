'use client'

import { FieldLabel, useField, useForm } from '@payloadcms/ui'
import cn from 'classnames'
import type { ArrayFieldClientProps } from 'payload'
import { useEffect, useRef, useState } from 'react'
import { ImageUploadCore } from 'src/components/form/image-upload/core'
import { Image } from 'src/core/models/image'
import styles from '../image-field.module.css'
import { loadImages } from '../load-images'

type PreviewRow = { image?: string | { id: string } | null }

function rowImageId(row: PreviewRow): string | undefined {
  if (!row.image) return undefined
  return typeof row.image === 'string' ? row.image : row.image.id
}

/**
 * Finds the single move (from/to index) that turns `before` into `after`.
 * framer-motion emits one reorder per crossed item, so each event is a single
 * displacement — which maps cleanly onto Payload's `moveFieldRow`.
 */
function findSingleMove(before: string[], after: string[]) {
  let start = 0
  while (start < before.length && before[start] === after[start]) start++
  if (start === before.length) return null

  const moved = after[start]
  return {
    moveFromIndex: before.indexOf(moved),
    moveToIndex: after.indexOf(moved)
  }
}

export function PreviewImagesField({
  path,
  schemaPath: schemaPathProp,
  field
}: ArrayFieldClientProps) {
  const schemaPath = schemaPathProp ?? field.name
  const { value: rowCount } = useField<number>({ path })
  const { addFieldRow, moveFieldRow, removeFieldRow, getDataByPath } = useForm()
  const [images, setImages] = useState<Image[]>([])
  const loaded = useRef(false)

  // Seed the gallery from the rows Payload loaded for the document. Runs once
  // form state is populated (rowCount flips from undefined to a number).
  useEffect(() => {
    if (loaded.current) return
    const rows = getDataByPath<PreviewRow[] | undefined>(path)
    if (!rows) return
    loaded.current = true

    const ids = rows.map(rowImageId).filter((id): id is string => !!id)
    if (!ids.length) return

    async function seed(imageIds: string[]) {
      const docs = await loadImages(imageIds)
      const byId = new Map(docs.map((doc) => [doc.id, doc]))
      setImages(
        imageIds
          .map((id) => byId.get(id))
          .filter((doc) => !!doc)
          .map((doc) => new Image(doc, doc.filename ?? ''))
      )
    }

    void seed(ids)
  }, [rowCount, getDataByPath, path])

  return (
    <div className="field-type">
      <FieldLabel label={field.label} path={path} />
      <ImageUploadCore
        images={images}
        multi
        prefix="books/previews"
        className={cn('upload-field-card', styles.gutter)}
        onUpload={(uploaded) => {
          uploaded.forEach((image) =>
            addFieldRow({
              path,
              schemaPath,
              subFieldState: {
                image: { value: image.id, initialValue: image.id, valid: true }
              }
            })
          )
          setImages((existing) => [...existing, ...uploaded])
        }}
        onDelete={(image) => {
          const rowIndex = images.findIndex((i) => i.id === image.id)
          if (rowIndex < 0) return
          removeFieldRow({ path, rowIndex })
          setImages((existing) => existing.filter((i) => i.id !== image.id))
        }}
        onReorder={(reordered) => {
          const move = findSingleMove(
            images.map((i) => i.id),
            reordered.map((i) => i.id)
          )
          if (move && move.moveFromIndex >= 0) moveFieldRow({ path, ...move })
          setImages(reordered)
        }}
      />
    </div>
  )
}
