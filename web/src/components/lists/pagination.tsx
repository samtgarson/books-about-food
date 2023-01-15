'use client'

import { FC } from 'react'
import { Pill } from 'src/components/atoms/pill'

export type PaginationProps = {
  filteredTotal?: number
  total: number
  perPage: number
  page: number
  onChange: (page: number) => void
  onPreload?: (page: number) => void
}

export const Pagination: FC<PaginationProps> = ({
  total,
  filteredTotal = total,
  perPage,
  page,
  onChange,
  onPreload
}) => {
  const totalPages = Math.ceil(filteredTotal / perPage)
  const pages = Array.from({ length: totalPages }, (_, i) => i)

  return (
    <ul className='flex gap-2 mt-20'>
      {pages.map((p) => (
        <li key={p} className='list-none'>
          <Pill
            onClick={() => onChange(p)}
            onMouseOver={() => onPreload?.(p)}
            selected={page === p}
            disabled={page === p}
            className='leading-5'
          >
            {p + 1}
          </Pill>
        </li>
      ))}
    </ul>
  )
}
