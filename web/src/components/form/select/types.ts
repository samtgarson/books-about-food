import { UseComboboxReturnValue } from 'downshift'
import { ComponentPropsWithoutRef, MutableRefObject, ReactNode } from 'react'
import { Stringified } from 'src/utils/superjson'

export type SelectValue<
  Value,
  Multi extends boolean = false
> = Multi extends true ? Value[] : Value | undefined

export interface SelectProps<
  Value extends { [key in ValueKey]: string },
  Multi extends boolean,
  ValueKey extends string
> extends Omit<
    ComponentPropsWithoutRef<'input'>,
    'onChange' | 'defaultValue' | 'multiple' | 'value'
  > {
  name: string
  label?: string
  options?: Value[]
  loadOptions?: (query: string) => Promise<Stringified<Value[]>>
  render:
    | keyof Value
    | ((value: Value, opts: { selected: boolean }) => ReactNode)
  valueKey: ValueKey
  multi: Multi
  defaultValue?: SelectValue<Value, Multi>
  allowCreate?: boolean
  onChange?: (value: SelectValue<Value, Multi>) => void
  onCreate?: (value: string) => Promise<Value | void>
  showChevron?: boolean
  separator?: string
}

export interface SelectContext<
  Value extends { [key in ValueKey]: string },
  ValueKey extends string
> extends UseComboboxReturnValue<Value> {
  searchInputRef: MutableRefObject<HTMLInputElement | null>
  multi: boolean
  selection: Value[]
  valueKey: ValueKey
  renderOption: (value: Value, opts: { selected: boolean }) => ReactNode
  loading: boolean
  showChevron: boolean
  createButtonSelected: boolean
  showCreateButton: (val: string) => boolean
  createOption: (val: string) => Promise<Value | void>
  placeholder?: string
}

export type SelectControl = {
  clear: () => void
}
