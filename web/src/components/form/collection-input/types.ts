import { ComponentType, ReactNode } from 'react'
import { Serializable } from 'src/utils/types'

export type CollectionInputItemProps = {
  avatar?: ReactNode
  title: string
  subtitle?: string
}

export type CollectionInputProps<
  Value extends { id: string },
  Serialized extends Serializable = Serializable
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
