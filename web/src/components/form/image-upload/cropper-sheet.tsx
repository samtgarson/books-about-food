import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import { Button } from 'src/components/atoms/button'
import * as Sheet from 'src/components/atoms/sheet'
import { Slider } from '../slider'

export type { Area }

type CropperSheetProps = {
  src?: File
  onSave(result: Area | null): Promise<void>
}
export function CropperSheet({ src, onSave }: CropperSheetProps) {
  const [url, setUrl] = useState<string | undefined>()
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [cropResult, setCropResult] = useState<Area | null>(null)
  const [loading, setLoading] = useState(false)
  const [zoom, setZoom] = useState(1)
  const sheet = useRef<Sheet.SheetControl>(null)

  useEffect(() => {
    sheet.current?.setOpen(!!src)
    if (src) {
      setUrl(URL.createObjectURL(src))
    } else {
      setUrl(undefined)
    }

    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [src]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Sheet.Root ref={sheet}>
      <Sheet.Content>
        <Sheet.Body containerClassName="!max-h-none h-fit">
          <div
            className={cn(
              'w-full h-full aspect-[4/3] relative mb-4',
              loading && 'pointer-events-none'
            )}
          >
            <Cropper
              image={url}
              crop={crop}
              onCropChange={setCrop}
              aspect={1}
              zoom={zoom}
              cropShape="round"
              onCropComplete={(_, r) => setCropResult(r)}
            />
          </div>
          <div className="flex gap-6">
            <Slider
              disabled={loading}
              min={1}
              max={3}
              step={0.01}
              value={[zoom]}
              onValueChange={([zoom]) => setZoom(zoom)}
              className="flex-grow w-full h-full"
            />
            <Button
              variant="dark"
              loading={loading}
              onClick={() => {
                setLoading(true)
                onSave(cropResult)
              }}
            >
              Save
            </Button>
          </div>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}
