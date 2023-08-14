'use client'

import { useDebouncedCallback } from 'use-debounce'
import cn from 'classnames'
import { FC, startTransition, useState } from 'react'
import { X } from 'react-feather'
import { Loader } from '../atoms/loader'

export type SearchProps = {
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  onReset?: () => void
  className?: string
  onBlur?: () => void
  autoFocus?: boolean
}

export const Search: FC<SearchProps> = ({
  onChange,
  value = '',
  placeholder = 'Search',
  className,
  onReset,
  onBlur,
  autoFocus = false
}) => {
  const [internalValue, setInternalValue] = useState(value)
  const loading = value !== internalValue

  const debouncedOnChange = useDebouncedCallback((value: string) => {
    startTransition(() => {
      onChange?.(value)
    })
  }, 500)

  return (
    <div className={cn('relative group flex items-center', className)}>
      <input
        autoFocus={autoFocus || internalValue.length > 0}
        type="text"
        value={internalValue}
        onChange={(e) => {
          setInternalValue(e.target.value)
          debouncedOnChange(e.target.value)
        }}
        onBlur={() => {
          onBlur?.()
          debouncedOnChange.flush()
        }}
        placeholder={placeholder}
        className={cn(
          'text-24 sm:text-32 flex-grow flex-shrink-0 bg-transparent placeholder-black placeholder-opacity-40 focus:outline-0 p-2 -mx-2 transition-colors focus-visible:bg-black focus-visible:bg-opacity-5 w-full'
        )}
      />
      {debouncedOnChange.isPending() || loading ? (
        <div className="absolute right-0 inset-y-0 flex items-center">
          <Loader />
        </div>
      ) : (
        <button
          onClick={() => {
            setInternalValue('')
            onChange?.('')
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
      )}
    </div>
  )
}
