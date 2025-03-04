import { useEffect, useState } from 'react'

export type Size = { width: number; height: number }
export function useVisualViewport() {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })

  useEffect(() => {
    const { visualViewport } = window
    if (!visualViewport) return

    const updateSize = () => {
      setSize({ width: visualViewport.width, height: visualViewport.height })
    }

    visualViewport?.addEventListener('resize', updateSize)
    updateSize()

    return () => visualViewport?.removeEventListener('resize', updateSize)
  }, [])

  return size
}
