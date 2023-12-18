'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import cn from 'classnames'
import { FC, ReactNode } from 'react'
import { MoreHorizontal } from 'react-feather'
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
  'bg-white rounded-lg flex flex-col animate-scale-in origin-[var(--radix-dropdown-menu-content-transform-origin)] shadow-md'

const itemClasses = (variant: ItemVariant) =>
  cn(
    'px-4 py-3.5 flex gap-3 outline-none transition-colors cursor-pointer data-[highlighted]:bg-grey/40',
    {
      'text-primary-red': variant === 'danger',
      'text-primary-purple': variant === 'admin'
    }
  )

export const Item: FC<
  DropdownMenu.MenuItemProps & {
    variant?: ItemVariant
  }
> = ({ children, variant = 'default', ...props }) => {
  const currentUser = useCurrentUser()

  if (variant === 'admin' && currentUser?.role !== 'admin') return null
  return (
    <DropdownMenu.Item {...props} className={itemClasses(variant)}>
      {children}
    </DropdownMenu.Item>
  )
}
