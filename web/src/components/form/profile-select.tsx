'use client'

import { Profile } from '@books-about-food/core/models/profile'
import { Select } from 'src/components/form/select'
import { createProfile, profiles } from '../edit/server-actions'
import { SelectProps } from './select/types'

export function ProfileSelect<Multi extends boolean>({
  value,
  onCreate,
  label,
  name,
  multi,
  onChange
}: {
  multi: Multi
  value: SelectProps<Profile, Multi, 'id'>['defaultValue']
  onChange?: SelectProps<Profile, Multi, 'id'>['onChange']
  onCreate?: (profile: Profile) => void
  label: string
  name: string
}) {
  return (
    <Select
      loadOptions={profiles}
      label={label}
      name={name}
      valueKey="id"
      render="name"
      defaultValue={value}
      required
      multi={multi}
      allowCreate
      onChange={onChange}
      onCreate={async (name) => {
        const newVal = new Profile(await createProfile(name))
        onCreate?.(newVal)
        return newVal
      }}
    />
  )
}
