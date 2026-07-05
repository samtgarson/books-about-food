'use client'

import cn from 'classnames'
import { Reorder } from 'framer-motion'
import Img from 'next/image'
import { Plus, X } from 'src/components/atoms/icons'
import { mouseAttrs } from 'src/components/atoms/mouse'
import { Image } from 'src/core/models/image'
import styles from './core.module.css'
import { ImageUploadButton } from './upload-button'

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
 * page-context gutter padding via `className`.
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
  return (
    <Reorder.Group
      axis="x"
      values={images}
      onReorder={onReorder}
      layoutScroll
      className={cn(
        styles.gallery,
        !images.length && styles.galleryEmpty,
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
      {(multi || !images?.length) && (
        <li
          className={cn(
            styles.uploadItem,
            !images.length && styles.uploadItemCentered
          )}
        >
          <ImageUploadButton
            multi={multi}
            prefix={prefix}
            croppable={croppable}
            onSuccess={onUpload}
            onError={onError}
            className={styles.uploadButton}
          >
            <Plus strokeWidth={1} size={28} />
          </ImageUploadButton>
        </li>
      )}
    </Reorder.Group>
  )
}
