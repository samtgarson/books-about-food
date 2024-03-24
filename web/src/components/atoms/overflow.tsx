'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import cn from 'classnames'
import Link from 'next/link'
import { ComponentProps, FC, ReactNode } from 'react'
import { ArrowUpRight, Icon, MoreHorizontal } from 'src/components/atoms/icons'
import { useCurrentUser } from 'src/hooks/use-current-user'

export type RootProps = {
  children: ReactNode
} & DropdownMenu.DropdownMenuTriggerProps

export const Root = ({ children, ...props }: RootProps) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger {...props}>
      <MoreHorizontal strokeWidth={1} />
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        side="bottom"
        align="end"
        className={containerClasses}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
)

export type ItemVariant = 'default' | 'danger' | 'admin'

const containerClasses =
  'float-menu flex flex-col animate-scale-in origin-[var(--radix-dropdown-menu-content-transform-origin)]'

const itemClasses = (variant: ItemVariant) =>
  cn(
    'py-2.5 pl-3 pr-2 flex items-center justify-between gap-4 outline-none transition-colors cursor-pointer data-[highlighted]:bg-grey rounded',
    {
      'text-primary-red': variant === 'danger'
    }
  )

type BaseAttrs = {
  children: ReactNode
  variant?: ItemVariant
  icon?: Icon | false
}
type LinkAttrs = { onClick?: never } & ComponentProps<typeof Link> & BaseAttrs
type ButtonAttrs = {
  href?: never
  onClick: (key?: string) => void | Promise<void>
  id?: string
} & BaseAttrs
export const Item: FC<LinkAttrs | ButtonAttrs> = ({
  id,
  children,
  variant = 'default',
  icon: Icon = ArrowUpRight,
  href,
  onClick,
  ...props
}) => {
  const currentUser = useCurrentUser()

  if (variant === 'admin' && currentUser?.role !== 'admin') return null
  if (href)
    return (
      <DropdownMenu.Item className={itemClasses(variant)} asChild>
        <Link href={href} {...props}>
          {children}
          {Icon === false ? null : <Icon strokeWidth={1} />}
        </Link>
      </DropdownMenu.Item>
    )

  return (
    <DropdownMenu.Item
      className={itemClasses(variant)}
      onSelect={async () => await onClick?.(id)}
    >
      {children}
      {Icon === false ? null : <Icon strokeWidth={1} />}
    </DropdownMenu.Item>
  )
}
