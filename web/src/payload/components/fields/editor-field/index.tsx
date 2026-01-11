'use client'
import {
  fieldBaseClass,
  FieldDescription,
  FieldError,
  FieldLabel,
  useField
} from '@payloadcms/ui'
import cn from 'classnames'
import type { TextFieldClientProps } from 'payload'
import { PayloadEditor } from './editor'
import './styles.scss'

export const EditorField = ({
  path,
  placeholder = 'Enter text here...',
  readOnly,
  field
}: TextFieldClientProps & { placeholder?: string }) => {
  const { value, setValue, showError } = useField<string>({ path })
  const {
    label,
    localized,
    required,
    admin: { description, disabled } = {}
  } = field

  return (
    <div className={cn(fieldBaseClass, 'editor', showError && 'error')}>
      <FieldLabel
        label={label}
        localized={localized}
        path={path}
        required={required}
        htmlFor=""
      />
      <div className={`${fieldBaseClass}__wrap`}>
        <FieldError path={path} showError={showError} />

        <PayloadEditor
          disabled={readOnly || disabled}
          onChange={setValue}
          value={value}
          placeholder={placeholder}
        />
        {description && (
          <FieldDescription description={description} path={path} />
        )}
      </div>
    </div>
  )
}
