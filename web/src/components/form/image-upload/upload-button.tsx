import cn from 'classnames'
import { ReactNode, forwardRef, useTransition } from 'react'
import { Loader } from 'src/components/atoms/loader'
import { Image } from 'src/models/image'
import { action } from './action'

export type ImageUploadButtonProps = {
  prefix: string
  multi?: boolean
  onSuccess: (images: Image[]) => void
  children: ReactNode
  className?: string
}

export const ImageUploadButton = forwardRef<
  HTMLInputElement,
  ImageUploadButtonProps
>(function ImageUploadButton(
  { prefix, multi, onSuccess, children, className },
  ref
) {
  const [isPending, startTransition] = useTransition()

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
            const { data: result = [] } = await action(prefix, fd)
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
