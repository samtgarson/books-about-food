import { useState, useTransition } from 'react'
import { errorToast } from 'src/components/utils/toaster'
import { Image } from 'src/core/models/image'
import { upload } from './action'
import type { Area } from './cropper-sheet'

export type UseImageUploadOptions = {
  prefix: string
  multi?: boolean
  croppable?: boolean
  onSuccess: (images: Image[]) => void
  onError?: (message: string) => void
}

export type ImageUploader = ReturnType<typeof useImageUpload>

const sizeLimit = 5 * 1024 * 1024

/**
 * Shared upload logic for picked *and* dropped files: validates size, routes a
 * single croppable file through the cropper sheet, otherwise uploads straight
 * away. Lets the file-input button and gallery drop zone share one pending
 * state and one cropper.
 */
export function useImageUpload({
  prefix,
  multi,
  croppable,
  onSuccess,
  onError
}: UseImageUploadOptions) {
  const [isPending, startTransition] = useTransition()
  const [croppableImage, setCroppableImage] = useState<File | null>(null)

  if (croppable && multi) {
    throw new Error('Croppable multi image upload is not supported')
  }

  async function uploadImage(file: File, cropArea?: Area) {
    const fd = new FormData()
    fd.append('image', file, file.name)
    const { data: [result] = [] } = await upload(prefix, fd, cropArea)

    return new Image(result, 'Uploaded image')
  }

  function handleFiles(input: File[]) {
    const images = input.filter((f) => f.type.startsWith('image/'))
    const files = multi ? images : images.slice(0, 1)
    if (!files.length || isPending) return

    if (files.some((f) => f.size > sizeLimit)) {
      errorToast('Please select a image smaller than 5mb')
      onError?.('Image is too large')
      return
    }

    if (croppable) {
      setCroppableImage(files[0])
      return
    }

    startTransition(async () => {
      const result = await Promise.all(files.map((f) => uploadImage(f)))
      onSuccess(result)
    })
  }

  async function saveCrop(area: Area | null) {
    if (!croppableImage) return
    const image = await uploadImage(croppableImage, area || undefined)
    setCroppableImage(null)
    onSuccess([image])
  }

  return { isPending, multi, croppableImage, handleFiles, saveCrop }
}
