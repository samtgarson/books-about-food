'use client'

import { JSX, useEffect, useMemo, useRef, useState } from 'react'
import { useEditProfile } from './context'
import ContentEditable from 'react-contenteditable'
import cn from 'classnames'
import { Edit2 } from 'react-feather'
import { UpdateProfileInput } from 'src/services/profiles/update-profile'

export type FieldProps = {
  as?: keyof JSX.IntrinsicElements
  attr: keyof UpdateProfileInput
  className?: string
  placeholder?: string
  render?: (value: string) => JSX.Element
}

export const Field = ({
  as = 'p',
  className,
  attr,
  placeholder,
  render
}: FieldProps) => {
  const { profile, editMode, onSave } = useEditProfile()
  const value = useRef<string>(profile[attr] ?? '')
  const ref = useRef<HTMLElement>(null)
  const [showPlaceholder, setShowPlaceholder] = useState(!profile[attr]?.length)
  const originalValue = useMemo(() => profile[attr], [profile, attr])

  useEffect(() => {
    if (!originalValue) return
    value.current = originalValue
    if (ref.current) ref.current.innerHTML = originalValue
  }, [originalValue])

  if (showPlaceholder && !editMode) return null
  return (
    <div className={cn(className, 'flex justify-start', editMode && 'mr-10')}>
      <div
        className={cn('flex gap-4 items-center', editMode && 'bg-white -mr-10')}
        onClick={() => ref.current?.focus()}
      >
        {!!render && !editMode && render(`${originalValue}`)}
        {(editMode || !render) && (
          <ContentEditable
            innerRef={ref}
            html={value.current}
            tagName={as}
            disabled={!editMode}
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
}
