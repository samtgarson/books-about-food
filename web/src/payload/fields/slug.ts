import { slugify } from '@books-about-food/shared/utils/slugify'
import type { TextField } from 'payload'

export function slugField(sourceField: string = 'title'): TextField {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    admin: { readOnly: true },
    hooks: {
      beforeValidate: [
        ({ data }) => {
          if (!data?.[sourceField]) return null
          return slugify(data[sourceField] as string)
        }
      ]
    }
  }
}
