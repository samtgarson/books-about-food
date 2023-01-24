import { ElementType, forwardRef } from 'react'
import { PolymorphicComponentPropWithRef, PolymorphicRef } from '../types'
import cn from 'classnames'

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
    const Component = as || 'button'
    return (
      <Component
        ref={ref}
        className={cn('px-4 py-2.5 text-16', variants[variant], className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Button.displayName = 'Button'
