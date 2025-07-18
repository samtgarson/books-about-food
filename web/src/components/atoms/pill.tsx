import cn from 'classnames'
import { ComponentProps, ReactNode, forwardRef } from 'react'

export type PillProps = {
  selected?: boolean
  disabled?: boolean
  variant?: 'bordered' | 'filled'
  small?: boolean
} & ComponentProps<'span'>

export const Pill = forwardRef<HTMLSpanElement, PillProps>(function Pill(
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
) {
  return (
    <span
      ref={ref}
      {...props}
      className={cn(
        'flex shrink-0 items-center justify-center whitespace-nowrap rounded-full text-14 leading-none',
        small ? 'px-3 py-1 text-16 leading-6' : 'px-4 py-3',
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
})

export function PillList({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn(className, 'flex flex-wrap justify-start gap-2')}>
      {children}
    </p>
  )
}
