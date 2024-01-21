'use client'

import { Profile } from '@books-about-food/core/models/profile'
import { UpdateProfileInput } from '@books-about-food/core/services/profiles/update-profile'
import {
  InPlaceField,
  InPlaceFieldProps
} from 'src/components/edit/in-place/field'
import { KeysMatching } from 'src/utils/types'
import { useEditProfile } from './context'

export type FieldProps = {
  attr: KeysMatching<Profile, string | null | undefined> &
    keyof UpdateProfileInput
} & Omit<InPlaceFieldProps, 'onSave' | 'value' | 'editMode'>

export const Field = ({ attr, ...props }: FieldProps) => {
  const { profile, editMode, onSave } = useEditProfile()
  const value = profile[attr]

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
