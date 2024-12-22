import cn from 'classnames'
import { ReactNode } from 'react'

export function Box({
  children,
  className,
  overlay = true
}: {
  children: ReactNode
  className?: string
  overlay?: boolean
}) {
  return (
    <div
      className={cn(
        'flex-1 flex flex-col justify-center gap-3 sm:gap-4 overflow-y-auto',
        overlay && 'bg-white group-[.sheet-drawer]:rounded-lg p-5 sm:p-8',
        className
      )}
    >
      {children}
    </div>
  )
}
