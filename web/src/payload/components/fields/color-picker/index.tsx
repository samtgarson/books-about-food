'use client'

import { Hsl } from '@books-about-food/shared/utils/types'
import { useField } from '@payloadcms/ui'
import { TextInput } from '@payloadcms/ui/fields/Text'
import Color from 'color'
import type { TextFieldClient } from 'payload'
import { type ChangeEvent } from 'react'
import './styles.css'

type ColorPickerFieldProps = {
  field: TextFieldClient
  path: string
  readOnly?: boolean
}

export function ColorPickerField({
  field,
  path,
  readOnly
}: ColorPickerFieldProps) {
  const {
    admin: { description, autoComplete, placeholder } = {},
    label,
    required
  } = field
  const {
    customComponents: { AfterInput, Description, Error, Label } = {},
    setValue,
    showError,
    value,
    disabled
  } = useField<Hsl>({ path })

  const color = value ? Color.hsl(value) : null
  const displayValue = color ? color.hex() : ''

  return (
    <TextInput
      AfterInput={AfterInput}
      BeforeInput={
        <input
          type="color"
          value={displayValue}
          onChange={(e) => setValue(Color(e.target.value).hsl().object())}
          style={{
            width: '40px',
            height: '40px',
            padding: 0,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            cursor: 'pointer',
            flexShrink: 0
          }}
        />
      }
      className="color-picker-field"
      Description={Description}
      description={description}
      Error={Error}
      htmlAttributes={{
        autoComplete: autoComplete || undefined
      }}
      Label={Label}
      label={label}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        setValue(Color(e.target.value).hsl().object())
      }
      path={path}
      placeholder={typeof placeholder === 'string' ? placeholder : '#000000'}
      readOnly={readOnly || disabled}
      required={required}
      showError={showError}
      value={displayValue}
    />
  )
}
