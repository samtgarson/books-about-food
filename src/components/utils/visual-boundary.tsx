'use client'

import { createContext, ReactNode, useContext, useState } from 'react'
import { useVisualViewport } from 'src/hooks/use-visual-viewport'

type VisualBoundaryContext = { ref: HTMLDivElement | null }

const VisualBoundaryContext = createContext<VisualBoundaryContext>(
  {} as VisualBoundaryContext
)

export function VisualBoundaryProvider({ children }: { children: ReactNode }) {
  const viewport = useVisualViewport()
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  return (
    <VisualBoundaryContext.Provider value={{ ref }}>
      <div
        data-visual-boundary
        ref={setRef}
        className="absolute z-0"
        aria-hidden
        style={{
          top: `${viewport.offsetTop}px`,
          left: 0,
          width: `${viewport.width}px`,
          height: `${viewport.height}px`
        }}
      />
      {children}
    </VisualBoundaryContext.Provider>
  )
}

export function useVisualBoundary() {
  return useContext(VisualBoundaryContext)
}
