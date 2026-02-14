import { useEffect, useState } from 'react'
import { useThrottledCallback } from 'use-debounce'

export type Viewport = { width: number; height: number; offsetTop: number }

function toViewport(vp: VisualViewport): Viewport {
  return {
    width: vp.width,
    height: vp.height,
    offsetTop: vp.pageTop
  }
}

export function useVisualViewport() {
  const [viewport, setViewport] = useState<Viewport>({
    width: 0,
    height: 0,
    offsetTop: 0
  })
  const updateSize = useThrottledCallback(
    function () {
      const { visualViewport } = window
      if (!visualViewport) return

      setViewport(toViewport(visualViewport))
    },
    200,
    { leading: false, trailing: true }
  )

  useEffect(() => {
    const { visualViewport } = window
    if (!visualViewport) return

    visualViewport.addEventListener('resize', updateSize)
    visualViewport.addEventListener('scroll', updateSize)
    updateSize()

    return () => {
      visualViewport.removeEventListener('resize', updateSize)
      visualViewport.removeEventListener('scroll', updateSize)
    }
  }, [updateSize])

  return viewport
}
