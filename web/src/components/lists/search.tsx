'use client'

import { FC, startTransition, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import cn from 'classnames'

export type SearchProps = {
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  className?: string
}

export const Search: FC<SearchProps> = ({
  onChange,
  value = '',
  placeholder = 'Search',
  className
}) => {
  const [internalValue, setInternalValue] = useState(value)
  const apply = useDebouncedCallback(
    (value: string) => onChange?.(value),
    250,
    { leading: true }
  )

  return (
    <input
      type="search"
      value={internalValue}
      onChange={(e) => {
        setInternalValue(e.target.value)
        startTransition(() => apply(e.target.value))
      }}
      placeholder={placeholder}
      className={cn(
        'text-32 flex-grow flex-shrink placeholder-black placeholder-opacity-40 w-full md:w-4',
        className
      )}
    />
  )
}
