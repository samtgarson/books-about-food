import { createContext, useContext } from 'react'

export type SheetScrollState = { top: boolean; bottom: boolean }
type SheetContext = {
  mobileOnly?: boolean
  close: () => void
  open: () => void
  scrollState: SheetScrollState
  setScrollState: (state: SheetScrollState) => void
}
export const SheetContext = createContext<SheetContext>({} as SheetContext)
export const useSheetContext = () => useContext(SheetContext)
