import { ElementType, forwardRef } from 'react'
import { PolymorphicComponentPropWithRef, PolymorphicRef } from '../types'
import cn from 'classnames'
import Link from 'next/link'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline'
export type ButtonProps<C extends ElementType> =
  PolymorphicComponentPropWithRef<
    C,
    {
      variant?: ButtonVariant
    }
  >

type Button = <C extends 'a' | 'button'>(
  props: ButtonProps<C>
) => JSX.Element | null

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-white',
  secondary: 'bg-grey',
  tertiary: 'bg-transparent',
  outline: 'bg-transparent border border-black'
}

export const Button = forwardRef(
  <C extends ElementType = 'button'>(
    { as, variant = 'primary', className, children, ...props }: ButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component =
      as === 'a' && props.href?.startsWith('/') ? Link : as || 'button'
    return (
      <Component
        ref={ref}
        className={cn(
          'px-4 py-2.5 text-16 whitespace-nowrap flex-shrink-0 flex gap-2 items-center justify-center',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Button.displayName = 'Button'
