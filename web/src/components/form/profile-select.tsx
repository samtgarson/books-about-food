'use client'

import { Profile } from '@books-about-food/core/models/profile'
import cn from 'classnames'
import { Select } from 'src/components/form/select'
import { Avatar } from '../atoms/avatar'
import { createProfile, profiles } from '../edit/books/server-actions'
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
      render={(profile, { selected }) => (
        <div className="flex gap-2 items-center w-full group mr-2">
          <Avatar
            className={cn(multi ? (selected ? '-ml-2 -my-px' : '-ml-1') : '')}
            profile={profile}
            size="3xs"
          />
          <span className="shrink-0 whitespace-nowrap">{profile.name}</span>
          {!selected && (
            <span className="opacity-40 whitespace-nowrap text-ellipsis overflow-hidden">
              {profile.jobTitle}
            </span>
          )}
        </div>
      )}
      defaultValue={value}
      required
      multi={multi}
      allowCreate
      hideDropdownWhenEmpty
      onChange={onChange}
      onCreate={async (name) => {
        const newVal = new Profile(await createProfile(name))
        onCreate?.(newVal)
        return newVal
      }}
    />
  )
}
