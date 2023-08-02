import { ReactNode, ComponentType } from 'react'

export type CollectionInputItemProps = {
  avatar?: ReactNode
  title: string
  subtitle?: string
}

export type CollectionInputProps<Value extends { id: string }> = {
  label: string
  name: string
  defaultValue?: Value[]
  render: (value: Value) => CollectionInputItemProps
  serialize: (value: Value) => Record<string, string>
  form: ComponentType<{
    onSubmit: (e: Value) => void
    value?: Value
  }>
} & Omit<React.ComponentProps<'input'>, 'defaultValue' | 'value' | 'form'>
