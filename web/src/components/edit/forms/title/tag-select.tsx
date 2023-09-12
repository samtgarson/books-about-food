'use client'

import { FC } from 'react'
import { Select } from 'src/components/form/select'
import { tags } from 'src/services/server-actions'

export const TagSelect: FC<{ value: string[] }> = ({ value }) => (
  <Select
    loadOptions={tags}
    name="tags"
    label="Tags"
    valueKey="name"
    render="name"
    defaultValue={value.map((name) => ({ name }))}
    multi
  />
)
