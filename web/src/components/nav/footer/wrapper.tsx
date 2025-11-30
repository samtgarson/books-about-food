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
    <footer className="mt-20 bg-white pt-12 pb-6 md:pt-20 md:pb-10" ref={ref}>
      {children}
    </footer>
  )
}
