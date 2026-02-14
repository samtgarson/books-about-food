import type { TextField } from 'payload'
import { slugify } from '../../utils/slugify'

export function slugField(sourceField: string = 'title'): TextField {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    admin: { readOnly: true },
    hooks: {
      beforeValidate: [
        ({ data, value }) => {
          if (value || !data?.[sourceField]) return value
          return slugify(data[sourceField] as string)
        }
      ]
    }
  }
}
