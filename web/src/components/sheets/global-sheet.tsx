'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { ClaimProfileSheet } from './claim-profile'
import {
  ComponentProps,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { SignInSheet } from './sign-in'

const SheetMap = {
  claimProfile: ClaimProfileSheet,
  signIn: SignInSheet
} as const

type SheetMap = {
  [K in keyof typeof SheetMap]: ComponentProps<typeof SheetMap[K]>
}

type GlobalSheetContext = {
  openSheet: <T extends keyof SheetMap>(sheet: T, props: SheetMap[T]) => void
  closeSheet: () => void
}

type SheetState = {
  Component: typeof SheetMap[keyof SheetMap]
  props: SheetMap[keyof SheetMap]
}

const GlobalSheetContext = createContext<GlobalSheetContext>(
  {} as GlobalSheetContext
)

export const useSheet = () => useContext(GlobalSheetContext)

export const useParamSheet = <T extends keyof SheetMap>(
  action: string,
  key: T,
  props: SheetMap[T]
) => {
  const { openSheet } = useSheet()

  useEffect(() => {
    const search = new URLSearchParams(location.search)
    const { pathname } = location
    if (search.get('action') === action) {
      openSheet(key, props)
      history.replaceState(null, '', pathname)
    }
  }, [action, key, openSheet, props])
}

export const GlobalSheetProvider = ({ children }: { children: ReactNode }) => {
  const [state, setSheet] = useState<SheetState | null>(null)
  const { Component, props } = state || {}

  const openSheet = useCallback(
    <T extends keyof SheetMap>(key: T, props: SheetMap[T]) => {
      setSheet({ Component: SheetMap[key], props })
    },
    []
  )

  const closeSheet = useCallback(() => {
    setSheet(null)
  }, [])

  return (
    <GlobalSheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}
      <Dialog.Root
        open={!!Component}
        onOpenChange={(open) => {
          console.log(open)
          !open && setSheet(null)
        }}
      >
        {/* @ts-expect-error how to type this? */}
        {Component && <Component {...props} />}
      </Dialog.Root>
    </GlobalSheetContext.Provider>
  )
}
