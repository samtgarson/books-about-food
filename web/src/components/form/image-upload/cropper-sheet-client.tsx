import cn from 'classnames'
import { useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import { Button } from 'src/components/atoms/button'
import { Slider } from '../slider'

export function CropperSheetContent({
  url,
  onSave
}: {
  url?: string
  onSave: (result: Area | null) => Promise<void>
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [cropResult, setCropResult] = useState<Area | null>(null)
  const [loading, setLoading] = useState(false)
  const [zoom, setZoom] = useState(1)
  return (
    <>
      <div
        className={cn(
          'relative mb-4 aspect-4/3 h-full w-full',
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
          className="h-full w-full grow"
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
    </>
  )
}
