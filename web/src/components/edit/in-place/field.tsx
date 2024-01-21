'use client'

import cn from 'classnames'
import { JSX, MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import ContentEditable from 'react-contenteditable'
import { Detail } from 'src/components/atoms/detail'
import { Edit2 } from 'src/components/atoms/icons'

export type InPlaceFieldProps = {
  as?: keyof JSX.IntrinsicElements
  value?: string | null
  editMode?: boolean
  onSave: (data: string | null) => Promise<boolean>
  className?: string
  placeholder?: string
  render?: (value: string) => JSX.Element
  detail?: boolean
  disabled?: boolean
}

export function InPlaceField({
  as = 'p',
  className,
  value: extValue,
  editMode,
  onSave,
  placeholder,
  render,
  detail,
  disabled
}: InPlaceFieldProps) {
  const value = useRef(extValue ?? '')
  const ref = useRef<HTMLElement>(null)
  const [showPlaceholder, setShowPlaceholder] = useState(!extValue?.length)
  const originalValue = useMemo(() => extValue || '', [extValue])

  useEffect(() => {
    value.current = originalValue
    if (ref.current) ref.current.innerHTML = originalValue
    setShowPlaceholder(!originalValue.length)
  }, [originalValue])

  const onFocus = async (e?: MouseEvent<HTMLElement>) => {
    if (!ref.current) return
    if (document.activeElement === ref.current) return e?.preventDefault()
    ref.current?.focus()

    // move cursor to end of text
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(ref.current)
    range.collapse(false)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }

  useEffect(() => {
    if (editMode) return
    value.current = originalValue
  }, [editMode, originalValue])

  if (showPlaceholder && !editMode) return null
  const content = (
    <div className={cn(className, 'flex justify-start', editMode && 'mr-10')}>
      <div
        className={cn('flex items-center gap-4', editMode && '-mr-10 bg-white')}
        onClick={onFocus}
      >
        {!!render && !editMode && render(`${originalValue}`)}
        {(editMode || !render || showPlaceholder) && (
          <div className="relative">
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
                  const success = await onSave(value.current || null)
                  if (!success) ref.current?.focus()
                }}
                onFocus={() => onFocus()}
                aria-label={placeholder}
                className={cn(
                  'select-text',
                  showPlaceholder && 'absolute inset-0'
                )}
              />
            )}
            {showPlaceholder && (
              <p className="pointer-events-none text-black/60">{placeholder}</p>
            )}
          </div>
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
