'use client'

import cn from 'classnames'
import { useState } from 'react'
import { Field } from '../field'
import { inputClasses } from '../input'
import { EditorProps } from './client'

import { Editor } from './client'
export { Editor }

export function FormEditor(
  props: EditorProps & { name: string; label: string }
) {
  const { name, label } = props
  const [value, setValue] = useState(props.value ?? '')
  return (
    <>
      <Field<'textarea'> name={name} label={label}>
        <input value={value} type="hidden" name={name} />
      </Field>
      <Editor
        {...props}
        className={cn(
          props.className,
          inputClasses('default', { disabled: false })
        )}
        onChange={function (val) {
          props.onChange?.(val)
          setValue(val)
        }}
      />
    </>
  )
}
