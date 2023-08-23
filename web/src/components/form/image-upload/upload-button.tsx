import { forwardRef, useTransition } from 'react'
import { Plus } from 'react-feather'
import { Image } from 'src/models/image'
import { action } from './action'
import { Loader } from 'src/components/atoms/loader'
import cn from 'classnames'

export type ImageUploadButtonProps = {
  prefix: string
  multi?: boolean
  onSuccess: (images: Image[]) => void
}

export const ImageUploadButton = forwardRef<
  HTMLInputElement,
  ImageUploadButtonProps
>(function ImageUploadButton({ prefix, multi, onSuccess }, ref) {
  const [isPending, startTransition] = useTransition()

  return (
    <label
      className={cn(
        'bg-white w-11 h-11 flex justify-center items-center my-20 mx-12',
        isPending ? 'pointer-events-none' : 'cursor-pointer'
      )}
    >
      {isPending ? <Loader /> : <Plus strokeWidth={1} size={28} />}

      <input
        type="file"
        className="hidden"
        multiple={multi}
        ref={ref}
        form={''}
        onChange={async (e) =>
          startTransition(async () => {
            if (!e.target.files?.length) return
            const fd = new FormData()
            Array.from(e.target.files).forEach((file) =>
              fd.append('image', file, file.name)
            )
            const result = await action(prefix, fd)
            const images = result.map(
              (image) => new Image(image, 'Uploaded image')
            )
            onSuccess(images)
          })
        }
      />
    </label>
  )
})
