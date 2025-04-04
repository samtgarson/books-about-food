import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { Area } from 'react-easy-crop'
import * as Sheet from 'src/components/atoms/sheet'

export type { Area }

const CropperSheetContent = dynamic(
  async () => (await import('./cropper-sheet-client')).CropperSheetContent
)

type CropperSheetProps = {
  src?: File
  onSave: (result: Area | null) => Promise<void>
}
export function CropperSheet({ src, onSave }: CropperSheetProps) {
  const [url, setUrl] = useState<string | undefined>()
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
      <Sheet.Content hideTitle>
        <Sheet.Body containerClassName="!max-h-none h-fit">
          <CropperSheetContent url={url} onSave={onSave} />
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}
