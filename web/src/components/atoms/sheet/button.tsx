'use client'

import { ComponentPropsWithRef } from 'react'
import { useSheet } from 'src/components/sheets/global-sheet'
import { SheetMap } from 'src/components/sheets/types'
import { Button } from '../button'

export type SheetButtonProps<
  K extends keyof SheetMap,
  P extends SheetMap[K]
> = Omit<ComponentPropsWithRef<'button'>, 'onClick'> & {
  sheet: K
  props: P
}

export function SheetButton<K extends keyof SheetMap, P extends SheetMap[K]>({
  children,
  sheet,
  props,
  ...buttonProps
}: SheetButtonProps<K, P>) {
  const { openSheet } = useSheet()

  return (
    <Button
      {...buttonProps}
      onClick={() => {
        openSheet(sheet, props)
      }}
    >
      {children}
    </Button>
  )
}
