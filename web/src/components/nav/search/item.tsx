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
        'flex items-center gap-4 p-3 sm:p-4 bg-white transition-opacity',
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
    <div className="w-5 h-5 sm:w-8 sm:h-8 flex flex-shrink-0 items-center justify-center">
      {children}
    </div>
  )
}

export const QuickSearchItem = { Root, Image: Image }
