'use client'

import { Publisher } from '@books-about-food/core/models/publisher'
import { UpdatePublisherInput } from '@books-about-food/core/services/publishers/update-publisher'
import {
  InPlaceField,
  InPlaceFieldProps
} from 'src/components/edit/in-place/field'
import { KeysMatching } from 'src/utils/types'
import { useEditPublisher } from './context'

export type FieldProps = {
  attr: Exclude<
    KeysMatching<Publisher, string | null | undefined> &
      keyof UpdatePublisherInput,
    'slug'
  >
} & Omit<InPlaceFieldProps, 'onSave' | 'value' | 'editMode'>

export const Field = ({ attr, ...props }: FieldProps) => {
  const { publisher, editMode, onSave } = useEditPublisher()
  const value = publisher[attr]

  return (
    <InPlaceField
      value={value}
      onSave={function (data) {
        return onSave({ [attr]: data })
      }}
      editMode={editMode}
      {...props}
    />
  )
}
