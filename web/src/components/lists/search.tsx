'use client'

import { useRouter } from 'next/navigation'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { addParam } from 'src/utils/path-helpers'
import { useDebouncedCallback } from 'use-debounce'

export type SearchProps = {
  paramName: string
  currentSearch?: string
  path: string
  placeholder?: string
}

export const Search: FC<SearchProps> = ({
  paramName,
  currentSearch = '',
  path,
  placeholder = 'Search'
}) => {
  const router = useRouter()
  const [value, setValue] = useState(currentSearch)
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue(value)
    apply(value)
  }

  const apply = useDebouncedCallback(
    (value: string) => router.push(addParam(path, paramName, value)),
    250,
    { leading: true }
  )

  useEffect(() => {
    if (currentSearch === '') setValue('')
  }, [currentSearch])

  return (
    <input
      type='search'
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  )
}
