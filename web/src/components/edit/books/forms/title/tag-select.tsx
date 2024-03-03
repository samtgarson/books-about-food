'use client'

import { FC } from 'react'
import { Select } from 'src/components/form/select'
import { tags } from '../../server-actions'

export const TagSelect: FC<{
  value: Array<{ name: string; slug: string }>
}> = ({ value }) => (
  <Select
    loadOptions={tags}
    name="tags"
    label="Tags"
    valueKey="slug"
    render="name"
    defaultValue={value}
    multi
  />
)
