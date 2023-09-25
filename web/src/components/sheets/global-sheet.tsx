'use client'

import * as Dialog from '@radix-ui/react-dialog'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react'
import { GlobalSheetContext, SheetMap, SheetState } from './types'

const globalSheetContext = createContext<GlobalSheetContext>(
  {} as GlobalSheetContext
)
export const useSheet = () => useContext(globalSheetContext)

export const GlobalSheetProvider = ({ children }: { children: ReactNode }) => {
  const [state, setSheet] = useState<SheetState | null>(null)
  const { Component, props } = state || {}

  const openSheet = useCallback<GlobalSheetContext['openSheet']>(
    (...[key, props]) => {
      setSheet({ Component: SheetMap[key], props })
    },
    []
  )

  const closeSheet = useCallback(() => {
    setSheet(null)
  }, [])

  return (
    <globalSheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}
      <Dialog.Root
        open={!!Component}
        onOpenChange={(open) => {
          !open && setSheet(null)
        }}
      >
        {/* @ts-expect-error how to type this? */}
        {Component && <Component {...props} />}
      </Dialog.Root>
    </globalSheetContext.Provider>
  )
}
