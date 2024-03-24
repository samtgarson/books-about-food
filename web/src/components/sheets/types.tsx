import { FC } from 'react'

export type SheetComponent<P> = FC<P> & { grey?: boolean }

export const SheetMap = {
  signIn: async () => import('./sign-in'),
  claimProfile: async () => import('./claim-profile'),
  suggestEdit: async () => import('./suggest-edit'),
  submitted: async () => import('./cookbook-submitted'),
  editPromo: async () => import('./edit-promo')
} as const

export type SheetMap = {
  [K in keyof typeof SheetMap]: Awaited<
    ReturnType<(typeof SheetMap)[K]>
  >['default'] extends SheetComponent<infer P>
    ? P
    : never
}

export type GlobalSheetContext = {
  openSheet: <T extends keyof SheetMap, P extends SheetMap[T]>(
    sheet: T,
    props: P
  ) => void
  closeSheet: () => void
}

export type SheetState = {
  Component: SheetComponent<SheetMap[keyof SheetMap]>
  props: SheetMap[keyof SheetMap]
}
