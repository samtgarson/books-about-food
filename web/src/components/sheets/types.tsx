import { ComponentProps } from 'react'
import { ClaimProfileSheet } from './claim-profile'
import { SignInSheet } from './sign-in'
import { Body } from '../atoms/sheet'

export const SheetMap = {
  loading: () => <Body loading />,
  signIn: SignInSheet,
  claimProfile: ClaimProfileSheet
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
