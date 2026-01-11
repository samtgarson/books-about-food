import type { TextField, TextFieldSingleValidation } from 'payload'

export function editorField(
  name: string,
  {
    admin,
    placeholder,
    ...opts
  }: Omit<TextField, 'name' | 'type' | 'hasMany' | 'maxRows' | 'minRows'> & {
    validate?: TextFieldSingleValidation
    placeholder?: string
  } = {}
): TextField {
  return {
    name,
    type: 'text',
    hasMany: false,
    ...opts,
    admin: {
      ...admin,
      components: {
        ...admin?.components,
        Field: {
          path: 'src/payload/components/fields/editor-field',
          clientProps: { placeholder },
          exportName: 'EditorField'
        }
      }
    }
  }
}
