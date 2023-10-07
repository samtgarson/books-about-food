import { ComponentProps, FC } from 'react'
import { ClaimProfileSheet } from './claim-profile'
import { SignInSheet } from './sign-in'
import { SuggestEditSheet } from './suggest-edit'

export type SheetComponent<P> = FC<P> & { grey?: boolean }

export const SheetMap = {
  signIn: SignInSheet,
  claimProfile: ClaimProfileSheet,
  suggestEdit: SuggestEditSheet
} as const

export type SheetMap = {
  [K in keyof typeof SheetMap]: ComponentProps<(typeof SheetMap)[K]>
}

export type GlobalSheetContext = {
  openSheet: <T extends keyof SheetMap, P extends SheetMap[T]>(
    sheet: T,
    props: P
  ) => void
  closeSheet: () => void
}

export type SheetState = {
  Component: (typeof SheetMap)[keyof SheetMap]
  props: SheetMap[keyof SheetMap]
}
