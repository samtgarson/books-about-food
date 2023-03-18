'use client'

import { FC, startTransition, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import cn from 'classnames'
import { X } from 'react-feather'

export type SearchProps = {
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  onReset?: () => void
  className?: string
  debounce?: number
  onBlur?: () => void
}

export const Search: FC<SearchProps> = ({
  onChange,
  value = '',
  placeholder = 'Search',
  className,
  debounce = 250,
  onReset,
  onBlur
}) => {
  const [internalValue, setInternalValue] = useState(value)
  const apply = useDebouncedCallback(
    (value: string) => onChange?.(value),
    debounce,
    { leading: true }
  )

  return (
    <div className={cn('relative group flex', className)}>
      <input
        autoFocus
        type="text"
        value={internalValue}
        onChange={(e) => {
          setInternalValue(e.target.value)
          startTransition(() => apply(e.target.value))
        }}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn(
          'text-24 sm:text-32 flex-grow flex-shrink-0 bg-transparent placeholder-black placeholder-opacity-40 focus:outline-0 p-2 -mx-2 transition-colors focus-visible:bg-black focus-visible:bg-opacity-5'
        )}
      />
      <button
        onClick={() => {
          setInternalValue('')
          apply('')
          onReset?.()
        }}
        className={cn(
          'absolute right-0 inset-y-0 flex items-center bg-transparent group-focus-within:opacity-100 opacity-0 transition-opacity',
          value?.length && 'opacity-100'
        )}
        aria-label="Reset"
      >
        <X strokeWidth={1} size={24} />
      </button>
    </div>
  )
}
