import cn from 'classnames'
import { ReactNode, forwardRef, useState, useTransition } from 'react'
import { Loader } from 'src/components/atoms/loader'
import { errorToast } from 'src/components/utils/toaster'
import { Image } from 'src/core/models/image'
import { useFormField } from '../context'
import { upload } from './action'
import { Area, CropperSheet } from './cropper-sheet'

export type ImageUploadButtonProps = {
  name: string
  prefix: string
  multi?: boolean
  onSuccess: (images: Image[]) => void
  children: ReactNode
  className?: string
  sizeLimit?: number
  croppable?: boolean
}

const sizeLimit = 5 * 1024 * 1024

function cropImageClientSide(file: File, cropArea: Area): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = cropArea.width
      canvas.height = cropArea.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Could not get canvas context'))

      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      )

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Could not create blob'))
        resolve(new File([blob], file.name, { type: 'image/png' }))
      }, 'image/png')
    }
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = URL.createObjectURL(file)
  })
}

export const ImageUploadButton = forwardRef<
  HTMLInputElement,
  ImageUploadButtonProps
>(function ImageUploadButton(
  { name, prefix, multi, onSuccess, children, className, croppable },
  ref
) {
  const { setError } = useFormField(name)
  const [isPending, startTransition] = useTransition()
  const [croppableImage, setCroppableImage] = useState<File | null>(null)

  if (croppable && multi) {
    throw new Error('Croppable multi image upload is not supported')
  }

  async function uploadImage(file: File) {
    const fd = new FormData()
    fd.append('image', file, file.name)
    const { data: [result] = [] } = await upload(prefix, fd)

    return new Image(result, 'Uploaded image')
  }

  return (
    <label
      className={cn(
        isPending ? 'pointer-events-none' : 'cursor-pointer',
        className
      )}
    >
      {isPending ? <Loader /> : children}

      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 h-0 w-0 opacity-0"
        multiple={multi}
        ref={ref}
        form=""
        onChangeCapture={async (e) => {
          const files = Array.from(e.currentTarget.files ?? [])
          if (!files?.length) return
          if (sizeLimit && files.some((f) => f.size > sizeLimit)) {
            errorToast('Please select a image smaller than 5mb')
            setError({ message: 'Image is too large' })
            return
          }

          if (croppable && !multi) {
            setCroppableImage(files[0])
            return
          }

          startTransition(async () => {
            const ops = files.map((f) => uploadImage(f))
            const result = await Promise.all(ops)

            onSuccess(result.flat())
          })
        }}
      />
      <CropperSheet
        src={croppableImage ?? undefined}
        onSave={async (result) => {
          if (!croppableImage) return
          const file = result
            ? await cropImageClientSide(croppableImage, result)
            : croppableImage
          const image = await uploadImage(file)
          setCroppableImage(null)

          onSuccess([image])
        }}
      />
    </label>
  )
})
