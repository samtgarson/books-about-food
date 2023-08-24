'use client'

import { JSX, useRef } from 'react'
import { useEditProfile } from './context'
import ContentEditable from 'react-contenteditable'
import cn from 'classnames'
import { Edit2 } from 'react-feather'
import { UpdateProfileInput } from 'src/services/profiles/update-profile'

export type FieldProps = {
  as?: keyof JSX.IntrinsicElements
  attr: keyof UpdateProfileInput
  className?: string
}

export const Field = ({ as = 'p', className, attr }: FieldProps) => {
  const { profile, editMode, onSave } = useEditProfile()
  const value = useRef<string>(`${profile[attr]}`)
  const ref = useRef<HTMLElement>(null)

  return (
    <div className={cn(className, 'flex justify-start')}>
      <div
        className={cn(
          'flex gap-4 items-center transition-colors',
          editMode && 'bg-white -mr-10'
        )}
        onClick={() => ref.current?.focus()}
      >
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
          }}
          onBlur={() => {
            if (value.current === profile[attr]) return
            onSave({ [attr]: value.current })
          }}
        />
        {editMode && (
          <Edit2
            strokeWidth={1}
            size={24}
            className="flex-shrink-0 animate-fade-in"
          />
        )}
      </div>
    </div>
  )
}
