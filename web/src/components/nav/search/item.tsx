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
        'flex items-center gap-4 p-3 transition-opacity sm:p-4',
        focused ? 'bg-white' : 'bg-white/0'
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
    <div className="flex size-5 shrink-0 items-center justify-center sm:h-8 sm:w-8">
      {children}
    </div>
  )
}

export const QuickSearchItem = { Root, Image: Image }
