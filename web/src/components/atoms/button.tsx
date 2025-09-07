import cn from 'classnames'
import Link, { LinkProps } from 'next/link'
import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react'
import { Loader } from './loader'

export type ButtonVariant = keyof typeof variants

type BaseButtonProps = {
  variant?: ButtonVariant
  loading?: boolean
  disabled?: boolean
  size?: 'small' | 'default'
}

const variants = {
  primary: 'bg-white',
  secondary: 'bg-grey',
  tertiary: 'bg-khaki',
  dark: 'bg-black text-white',
  outline: 'border border-black',
  danger: 'border border-primary-red text-primary-red'
} as const

export type ButtonProps = BaseButtonProps &
  (
    | ({
        href: LinkProps['href']
      } & ComponentPropsWithoutRef<typeof Link>)
    | ({
        href?: never
      } & ComponentPropsWithoutRef<'button'>)
  )

export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    loading,
    className,
    children,
    disabled,
    size = 'default',
    ...props
  }: ButtonProps,
  ref
) {
  const classes = cn(
    'relative block shrink-0 whitespace-nowrap transition ease-out rounded-full',
    variants[variant],
    className,
    loading && 'pointer-events-none',
    disabled && 'opacity-50 pointer-events-none',
    size === 'default' && 'px-4 py-2.5 text-16',
    size === 'small' && 'px-3 py-2 text-14'
  )
  if ('href' in props === false) {
    return (
      <button
        ref={ref as ForwardedRef<HTMLButtonElement>}
        className={classes}
        {...(props as ComponentPropsWithoutRef<'button'>)}
        disabled={disabled}
      >
        <ButtonContents loading={loading}>{children}</ButtonContents>
      </button>
    )
  }

  return (
    <Link
      aria-disabled={disabled}
      className={classes}
      {...(props as ComponentPropsWithoutRef<typeof Link>)}
      ref={ref as ForwardedRef<HTMLAnchorElement>}
    >
      <ButtonContents loading={loading}>{children}</ButtonContents>
    </Link>
  )
})

function ButtonContents({
  loading,
  children
}: {
  loading?: boolean
  children: React.ReactNode
}) {
  return (
    <>
      <span
        className={cn(
          'flex items-center justify-center gap-2 transition ease-out',
          loading && 'opacity-0'
        )}
      >
        {children}
      </span>
      {loading && <Loader className="absolute inset-0 m-auto" />}
    </>
  )
}
