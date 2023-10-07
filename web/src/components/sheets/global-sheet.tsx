'use client'

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState
} from 'react'
import * as Sheet from 'src/components/atoms/sheet'
import { SheetControl } from 'src/components/atoms/sheet'
import { GlobalSheetContext, SheetMap, SheetState } from './types'

const globalSheetContext = createContext<GlobalSheetContext>(
  {} as GlobalSheetContext
)
export const useSheet = () => useContext(globalSheetContext)

export const GlobalSheetProvider = ({ children }: { children: ReactNode }) => {
  const sheet = useRef<SheetControl>(null)
  const [state, setSheet] = useState<SheetState | null>(null)
  const { Component, props } = state || {}

  const openSheet = useCallback<GlobalSheetContext['openSheet']>(
    (...[key, props]) => {
      setSheet({ Component: SheetMap[key], props })
      sheet.current?.setOpen(true)
    },
    []
  )

  const closeSheet = useCallback(() => {
    setSheet(null)
  }, [])

  return (
    <globalSheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}
      <Sheet.Root
        ref={sheet}
        grey={Component?.grey}
        onClose={() => {
          sheet.current?.setOpen(false)
          setSheet(null)
        }}
      >
        {/* @ts-expect-error how to type this */}
        {Component && <Component {...props} />}
      </Sheet.Root>
    </globalSheetContext.Provider>
  )
}
