'use client'

import { FC } from 'react'

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
  const displayTotal =
    filteredTotal && filteredTotal !== total ? filteredTotal : total

  return (
    <div className='flex gap-2'>
      <ul className='flex gap-2'>
        {pages.map((p) => (
          <li key={p} className='list-none'>
            {p === page ? (
              <span className='text-gray-500'>{p + 1}</span>
            ) : (
              <button
                onClick={() => onChange(p)}
                onMouseOver={() => onPreload?.(p)}
              >
                {p + 1}
              </button>
            )}
          </li>
        ))}
      </ul>
      <p>
        {displayTotal}
        {displayTotal !== total && ` of ${total}`} results
      </p>
    </div>
  )
}
