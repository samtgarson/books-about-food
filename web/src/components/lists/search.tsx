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
  debounceDelay?: number
}

export const Search: FC<SearchProps> = ({
  onChange,
  value = '',
  placeholder = 'Search',
  className,
  onReset,
  onBlur,
  autoFocus = false,
  debounceDelay = 500
}) => {
  const [internalValue, setInternalValue] = useState(value)
  const loading = value !== internalValue

  const debouncedOnChange = useDebouncedCallback((value: string) => {
    startTransition(() => {
      onChange?.(value)
    })
  }, debounceDelay)

  return (
    <div
      className={cn(
        'group relative flex items-center text-24 sm:text-32',
        className
      )}
    >
      <input
        autoFocus={autoFocus || internalValue.length > 0}
        type="search"
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
          '-mx-2 w-full shrink-0 grow bg-transparent p-2 placeholder-black/40 transition-colors focus:outline-0 focus-visible:bg-black/5'
        )}
      />
      {debouncedOnChange.isPending() || loading ? (
        <div className="absolute inset-y-0 right-0 flex items-center">
          <Loader />
        </div>
      ) : internalValue.length ? (
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
      ) : null}
    </div>
  )
}
