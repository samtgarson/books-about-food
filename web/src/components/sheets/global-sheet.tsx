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
import { SheetMap, type GlobalSheetContext, type SheetState } from './types'

const GlobalSheetContext = createContext<GlobalSheetContext>(
  {} as GlobalSheetContext
)
export const useSheet = () => useContext(GlobalSheetContext)

export const GlobalSheetProvider = ({ children }: { children: ReactNode }) => {
  const sheet = useRef<SheetControl>(null)
  const [state, setSheet] = useState<SheetState | null>(null)
  const { Component, props } = state || {}

  const openSheet = useCallback<GlobalSheetContext['openSheet']>(
    async (...[key, props]) => {
      const Component = (await SheetMap[key]()).default
      setSheet({ Component, props } as SheetState)
      sheet.current?.setOpen(true)
    },
    []
  )

  const closeSheet = useCallback(() => {
    setSheet(null)
  }, [])

  return (
    <GlobalSheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}
      <Sheet.Root
        ref={sheet}
        grey={Component?.grey}
        onClose={() => {
          setSheet(null)
        }}
      >
        {Component && <Component {...props} />}
      </Sheet.Root>
    </GlobalSheetContext.Provider>
  )
}
