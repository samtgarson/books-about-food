import cn from 'classnames'
import { ReactNode } from 'react'

export function Box({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'bg-white group-[.sheet-drawer]:rounded-lg p-5 sm:p-8 flex-1 flex flex-col justify-center gap-3 sm:gap-4 overflow-y-auto',
        className
      )}
    >
      {children}
    </div>
  )
}