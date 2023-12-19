'use client'

import cn from 'classnames'
import { FC, startTransition, useState } from 'react'
import { X } from 'src/components/atoms/icons'
import { useDebouncedCallback } from 'use-debounce'
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
    <div
      className={cn(
        'group relative flex items-center text-24 sm:text-32',
        className
      )}
    >
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
          '-mx-2 w-full flex-shrink-0 flex-grow bg-transparent p-2 placeholder-black placeholder-opacity-40 transition-colors focus:outline-0 focus-visible:bg-black focus-visible:bg-opacity-5'
        )}
      />
      {debouncedOnChange.isPending() || loading ? (
        <div className="absolute inset-y-0 right-0 flex items-center">
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
            'absolute inset-y-0 right-0 flex items-center bg-transparent opacity-0 transition-opacity group-focus-within:opacity-100',
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
