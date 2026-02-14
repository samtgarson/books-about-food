'use client'

import {
  InPlaceField,
  InPlaceFieldProps
} from 'src/components/edit/in-place/field'
import { Profile } from 'src/core/models/profile'
import { UpdateProfileInput } from 'src/core/services/profiles/update-profile'
import { KeysMatching } from 'src/utils/types'
import { useEditProfile } from './context'

export type FieldProps = {
  attr: Exclude<
    KeysMatching<Profile, string | null | undefined> & keyof UpdateProfileInput,
    'slug'
  >
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
