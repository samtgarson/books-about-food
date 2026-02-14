import { JSONField } from 'payload'

export const dayOnlyDisplayFormat = 'MMM do, yyyy'

export function colorField(
  name: string,
  field?: Partial<JSONField>
): JSONField {
  return {
    ...field,
    name,
    type: 'json',
    jsonSchema: {
      uri: 'http://books-about-food.com/schemas/hsl-color.json',
      fileMatch: ['/*'],
      schema: {
        type: 'object',
        properties: {
          h: { type: 'number' },
          s: { type: 'number' },
          l: { type: 'number' }
        },
        required: ['h', 's', 'l']
      }
    },
    admin: {
      ...field?.admin,
      components: {
        Field: {
          path: 'src/payload/components/fields/color-picker/index.tsx#ColorPickerField'
        }
      }
    }
  }
}
