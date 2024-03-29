import type * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ReactNode } from 'react'

export type RootProps = {
  children: ReactNode
} & DropdownMenu.DropdownMenuTriggerProps

export type ItemVariant = 'default' | 'danger' | 'admin'
