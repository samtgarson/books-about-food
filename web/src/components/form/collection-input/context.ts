import { Context, createContext } from 'react'
import { CollectionInputProps } from './types'

export type CollectionInputContext<Value extends { id: string }> = {
  FormComponent: CollectionInputProps<Value>['form']
  addValue: (value: Value) => void
  removeValue: (id: string) => void
  values: Value[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _context = createContext({} as CollectionInputContext<any>)
export const createCollectionInputContext = <Value extends { id: string }>() =>
  _context as Context<CollectionInputContext<Value>>
