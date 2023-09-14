'use client'

import { JSX, useEffect, useMemo, useRef, useState } from 'react'
import { useEditProfile } from './context'
import ContentEditable from 'react-contenteditable'
import cn from 'classnames'
import { Edit2 } from 'react-feather'
import { KeysMatching } from 'src/utils/types'
import { Profile } from 'src/models/profile'
import { UpdateProfileInput } from 'src/services/profiles/update-profile'
import { Detail } from 'src/components/atoms/detail'

export type FieldProps = {
  as?: keyof JSX.IntrinsicElements
  attr: KeysMatching<Profile, string | null | undefined> &
    keyof UpdateProfileInput
  className?: string
  placeholder?: string
  render?: (value: string) => JSX.Element
  detail?: boolean
  onClick?: () => void
  disabled?: boolean
}

export const Field = ({
  as = 'p',
  className,
  attr,
  placeholder,
  render,
  detail,
  onClick,
  disabled
}: FieldProps) => {
  const { profile, editMode, onSave } = useEditProfile()
  const value = useRef(profile[attr] ?? '')
  const ref = useRef<HTMLElement>(null)
  const [showPlaceholder, setShowPlaceholder] = useState(!profile[attr]?.length)
  const originalValue = useMemo(() => profile[attr] || '', [profile, attr])

  useEffect(() => {
    value.current = originalValue
    if (ref.current) ref.current.innerHTML = originalValue
    setShowPlaceholder(!originalValue.length)
  }, [originalValue])

  const onFocus = async () => {
    if (!onClick) return ref.current?.focus()
    onClick()
  }

  if (showPlaceholder && !editMode) return null
  const content = (
    <div className={cn(className, 'flex justify-start', editMode && 'mr-10')}>
      <div
        className={cn('flex gap-4 items-center', editMode && 'bg-white -mr-10')}
        onClick={onFocus}
      >
        {!!render && !editMode && render(`${originalValue}`)}
        {(editMode || !render) && (
          <ContentEditable
            innerRef={ref}
            html={value.current}
            tagName={as}
            disabled={!editMode || disabled}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
            onChange={(e) => {
              value.current = e.currentTarget.textContent || ''
              setShowPlaceholder(!value.current.length)
            }}
            onBlur={async () => {
              if (value.current === originalValue) return
              await onSave({ [attr]: value.current || null })
            }}
            onFocus={onFocus}
            aria-label={placeholder}
          />
        )}
        {showPlaceholder && (
          <p className="-ml-4 text-black/60 pointer-events-none">
            {placeholder}
          </p>
        )}
        {editMode && (
          <Edit2 strokeWidth={1} size={24} className="flex-shrink-0" />
        )}
      </div>
    </div>
  )

  if (!detail) return content

  return <Detail maxWidth>{content}</Detail>
}
