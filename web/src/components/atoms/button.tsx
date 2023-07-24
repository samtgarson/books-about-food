import cn from 'classnames'
import Link from 'next/link'
import { ElementType, forwardRef } from 'react'
import {
  PolymorphicComponentPropWithRef,
  PolymorphicRef
} from './polymorhphic-types'
import { Loader } from './loader'

export type ButtonVariant = keyof typeof variants
export type ButtonProps<C extends ElementType> =
  PolymorphicComponentPropWithRef<
    C,
    {
      variant?: ButtonVariant
      loading?: boolean
    }
  >

type Button = <C extends 'a' | 'button'>(
  props: ButtonProps<C>
) => JSX.Element | null

const variants = {
  primary: 'bg-white',
  secondary: 'bg-grey',
  tertiary: 'bg-transparent',
  dark: 'bg-black text-white',
  outline: 'bg-transparent border border-black'
} as const

export const Button = forwardRef(
  <C extends ElementType = 'button'>(
    {
      as,
      variant = 'primary',
      loading,
      className,
      children,
      ...props
    }: ButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component =
      as === 'a' || props.href?.startsWith('/') ? Link : as || 'button'
    return (
      <Component
        ref={ref}
        className={cn(
          'px-4 py-2.5 text-16 whitespace-nowrap flex-shrink-0 relative block',
          variants[variant],
          className,
          loading && 'pointer-events-none'
        )}
        {...props}
      >
        <span
          className={cn(
            'flex gap-2 items-center justify-center',
            loading && 'opacity-0'
          )}
        >
          {children}
        </span>
        {loading && <Loader className="absolute m-auto inset-0" />}
      </Component>
    )
  }
)

Button.displayName = 'Button'
