'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { useNav } from '../context'

export function FooterWrapper({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { setFooterVisible } = useNav()

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = !!entries[0].isIntersecting
        setFooterVisible(visible)
      },
      { threshold: [0.25] }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [setFooterVisible])

  return (
    <footer className="mt-20 bg-white pb-6 pt-12 md:pb-10 md:pt-20" ref={ref}>
      {children}
    </footer>
  )
}
