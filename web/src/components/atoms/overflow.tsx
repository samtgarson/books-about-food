'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { FC, ReactNode } from 'react'
import { ChevronRight, Lock, MoreHorizontal } from 'react-feather'
import cn from 'classnames'
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

export type ItemVariant = 'default' | 'danger'

const containerClasses =
  'bg-white p-4 flex flex-col animate-scale-in origin-[var(--radix-dropdown-menu-content-transform-origin)]'

const itemClasses = (variant: ItemVariant) =>
  cn('px-4 py-3 flex gap-4 outline-none transition-colors cursor-pointer', {
    'data-[highlighted]:bg-grey': variant === 'default',
    'text-warning data-[highlighted]:bg-warning/10': variant === 'danger'
  })

export const Item: FC<
  DropdownMenu.MenuItemProps & {
    variant?: ItemVariant
  }
> = ({ children, variant = 'default', ...props }) => {
  return (
    <DropdownMenu.Item {...props} className={itemClasses(variant)}>
      {children}
    </DropdownMenu.Item>
  )
}

export const AdminArea: FC<{ children: ReactNode }> = ({ children }) => {
  const currentUser = useCurrentUser()

  if (currentUser?.role !== 'admin') return null
  return (
    <DropdownMenu.Sub>
      <hr className="my-4 px-8 -mx-4 border-grey border-2" />
      <DropdownMenu.SubTrigger className={itemClasses('default')}>
        <Lock strokeWidth={1} />
        Admin Tools
        <ChevronRight strokeWidth={1} />
      </DropdownMenu.SubTrigger>
      <DropdownMenu.Portal>
        <DropdownMenu.SubContent
          alignOffset={-16}
          sideOffset={20}
          className={containerClasses}
        >
          {children}
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  )
}
