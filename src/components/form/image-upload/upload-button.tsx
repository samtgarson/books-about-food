import cn from 'classnames'
import { ReactNode, forwardRef } from 'react'
import { Loader } from 'src/components/atoms/loader'
import styles from './core.module.css'
import { CropperSheet } from './cropper-sheet'
import {
  ImageUploader,
  UseImageUploadOptions,
  useImageUpload
} from './use-image-upload'

type ImageUploadInputProps = {
  uploader: ImageUploader
  children: ReactNode
  className?: string
}

/**
 * The clickable label + hidden file input + cropper sheet, driven by an
 * externally owned `useImageUpload` so a parent can also feed it dropped files.
 */
export const ImageUploadInput = forwardRef<
  HTMLInputElement,
  ImageUploadInputProps
>(function ImageUploadInput({ uploader, children, className }, ref) {
  const { isPending, multi, croppableImage, handleFiles, saveCrop } = uploader

  return (
    <label
      className={cn(
        isPending ? styles.uploadLabelPending : styles.uploadLabel,
        className
      )}
    >
      {isPending ? <Loader /> : children}

      <input
        type="file"
        accept="image/*"
        className={styles.fileInput}
        multiple={multi}
        ref={ref}
        form=""
        onChangeCapture={(e) => {
          handleFiles(Array.from(e.currentTarget.files ?? []))
          e.currentTarget.value = ''
        }}
      />
      <CropperSheet src={croppableImage ?? undefined} onSave={saveCrop} />
    </label>
  )
})

export type ImageUploadButtonProps = UseImageUploadOptions & {
  children: ReactNode
  className?: string
}

export const ImageUploadButton = forwardRef<
  HTMLInputElement,
  ImageUploadButtonProps
>(function ImageUploadButton({ children, className, ...options }, ref) {
  const uploader = useImageUpload(options)

  return (
    <ImageUploadInput ref={ref} uploader={uploader} className={className}>
      {children}
    </ImageUploadInput>
  )
})
