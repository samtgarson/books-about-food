'use client'

import { Select } from 'src/components/form/select'
import { Profile } from 'src/models/profile'
import { profiles } from '../../server-actions'
import { createProfile } from './action'

export function AuthorSelect({ authors }: { authors: Profile[] }) {
  return (
    <Select
      loadOptions={profiles}
      label="Author(s)"
      name="authorIds"
      valueKey="id"
      render="name"
      defaultValue={authors}
      required
      multi
      allowCreate
      data-superjson
      onCreate={async (name) => new Profile(await createProfile(name))}
    />
  )
}
