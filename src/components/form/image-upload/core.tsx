'use client'

import cn from 'classnames'
import { Reorder } from 'framer-motion'
import Img from 'next/image'
import { DragEvent, useState } from 'react'
import { Plus, X } from 'src/components/atoms/icons'
import { mouseAttrs } from 'src/components/atoms/mouse'
import { Image } from 'src/core/models/image'
import styles from './core.module.css'
import { ImageUploadInput } from './upload-button'
import { useImageUpload } from './use-image-upload'

function hasFiles(e: DragEvent) {
  return e.dataTransfer.types.includes('Files')
}

export type ImageUploadCoreProps = {
  images: Image[]
  prefix: string
  multi?: boolean
  croppable?: boolean
  className?: string
  onUpload: (images: Image[]) => void
  onDelete: (image: Image) => void
  onReorder: (images: Image[]) => void
  onError?: (message: string) => void
}

/**
 * Headless-ish gallery of images with drag-to-reorder, per-item delete and an
 * upload button. Holds no state of its own — the parent owns the `images` array
 * and reacts to the `onUpload` / `onDelete` / `onReorder` callbacks. This lets
 * the same UI back both the frontend Radix form (`ImageUpload`) and the Payload
 * admin field (`PreviewImagesField`). Styling is self-contained (see
 * `core.module.css`) so it renders identically in both contexts; callers pass
 * page-context gutter padding via `className`. While the upload button is
 * shown, image files can also be dropped anywhere on the gallery.
 */
export function ImageUploadCore({
  images,
  prefix,
  multi,
  croppable,
  className,
  onUpload,
  onDelete,
  onReorder,
  onError
}: ImageUploadCoreProps) {
  const uploader = useImageUpload({
    prefix,
    multi,
    croppable,
    onSuccess: onUpload,
    onError
  })
  const [isDragging, setIsDragging] = useState(false)
  const canUpload = multi || !images.length

  function onDragOver(e: DragEvent<HTMLUListElement>) {
    if (!canUpload || !hasFiles(e)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragging(true)
  }

  function onDragLeave(e: DragEvent<HTMLUListElement>) {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return
    setIsDragging(false)
  }

  function onDrop(e: DragEvent<HTMLUListElement>) {
    if (!canUpload || !hasFiles(e)) return
    e.preventDefault()
    setIsDragging(false)
    uploader.handleFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <Reorder.Group
      axis="x"
      values={images}
      onReorder={onReorder}
      layoutScroll
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        styles.gallery,
        !images.length && styles.galleryEmpty,
        isDragging && styles.galleryDragging,
        className
      )}
    >
      {images.map((image) => (
        <Reorder.Item
          key={image.id}
          value={image}
          className={cn(
            styles.item,
            images.length === 1 && !multi && styles.itemCentered,
            images.length > 1 && styles.itemDraggable
          )}
          {...mouseAttrs({ mode: 'clickable' })}
        >
          <Img className={styles.image} {...image.imageAttrs(208)} />
          <button
            type="button"
            className={styles.remove}
            onClick={() => onDelete(image)}
            title="Remove this image"
          >
            <X size={16} strokeWidth={1} />
          </button>
        </Reorder.Item>
      ))}
      {canUpload && (
        <li
          className={cn(
            styles.uploadItem,
            !images.length && styles.uploadItemCentered
          )}
        >
          <ImageUploadInput uploader={uploader} className={styles.uploadButton}>
            <Plus strokeWidth={1} size={28} />
          </ImageUploadInput>
        </li>
      )}
    </Reorder.Group>
  )
}
