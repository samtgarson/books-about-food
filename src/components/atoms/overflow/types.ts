import { DropdownMenu } from 'radix-ui'
import { ReactNode } from 'react'

export type RootProps = {
  children: ReactNode
} & DropdownMenu.DropdownMenuTriggerProps

export type ItemVariant = 'default' | 'danger' | 'admin'
