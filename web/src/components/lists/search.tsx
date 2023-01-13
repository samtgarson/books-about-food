'use client'

import { FC, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export type SearchProps = {
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
}

export const Search: FC<SearchProps> = ({
  onChange,
  value = '',
  placeholder = 'Search'
}) => {
  const [internalValue, setInternalValue] = useState(value)
  const apply = useDebouncedCallback(
    (value: string) => onChange?.(value),
    250,
    { leading: true }
  )

  return (
    <input
      type='search'
      value={internalValue}
      onChange={(e) => {
        setInternalValue(e.target.value)
        apply(e.target.value)
      }}
      placeholder={placeholder}
    />
  )
}
