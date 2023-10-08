import cn from 'classnames'
import Link from 'next/link'
import { ReactNode } from 'react'

type QuickSearchItemProps = {
  focused?: boolean
  onHover?: () => void
  href: string
  id?: string
  children: ReactNode
}

function Root({ focused, onHover, children, ...props }: QuickSearchItemProps) {
  return (
    <Link
      className={cn(
        'flex items-center gap-4 px-5 py-4 bg-white transition-opacity',
        focused ? 'bg-opacity-100' : 'bg-opacity-0'
      )}
      onMouseMove={onHover}
      {...props}
    >
      {children}
    </Link>
  )
}

function Image({ children }: { children: ReactNode }) {
  return (
    <div className="w-12 flex flex-shrink-0 items-center justify-center">
      {children}
    </div>
  )
}

export const QuickSearchItem = { Root, Image: Image }
