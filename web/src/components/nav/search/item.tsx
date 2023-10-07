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

export function QuickSearchItem({
  focused,
  onHover,
  children,
  ...props
}: QuickSearchItemProps) {
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
