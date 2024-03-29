import dynamic from 'next/dynamic'
import { MoreHorizontal } from 'src/components/atoms/icons'

export type * from './types'

export const Root = dynamic(async () => (await import('./client')).Root, {
  loading: function OverflowLoading() {
    return <MoreHorizontal strokeWidth={1} />
  }
})

export const Item = dynamic(async () => (await import('./client')).Item, {
  ssr: false
})
