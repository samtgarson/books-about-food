import { ReactNode, ComponentType } from 'react'

export type CollectionInputItemProps = {
  avatar?: ReactNode
  title: string
  subtitle?: string
}

export type CollectionInputProps<
  Value extends { id: string },
  Serialized extends Record<string, string | boolean | number | null>
> = {
  label: string
  name: string
  defaultValue?: Value[]
  render: (value: Value) => CollectionInputItemProps
  serialize?: (value: Value) => Serialized
  form: ComponentType<{
    onSubmit: (e: Value) => void
    value?: Value
  }>
} & Omit<React.ComponentProps<'input'>, 'defaultValue' | 'value' | 'form'>
