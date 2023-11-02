import cn from 'classnames'
import { ComponentProps, forwardRef } from 'react'

export type PillProps = {
  selected?: boolean
  disabled?: boolean
  variant?: 'bordered' | 'filled'
  small?: boolean
} & ComponentProps<'span'>

export const Pill = forwardRef<HTMLSpanElement, PillProps>(
  (
    {
      children,
      selected,
      className,
      disabled,
      variant = 'bordered',
      small,
      ...props
    },
    ref
  ) => (
    <span
      ref={ref}
      {...props}
      className={cn(
        'text-14 flex flex-shrink-0 items-center justify-center rounded-full leading-none',
        small ? 'px-3 py-1 leading-6 text-16' : 'px-4 py-3',
        selected ? 'bg-black text-white' : 'text-black',
        disabled && 'pointer-events-none',
        variant === 'bordered' && 'border border-black',
        variant === 'filled' && 'bg-khaki',
        className
      )}
    >
      {children}
    </span>
  )
)

Pill.displayName = 'Pill'
