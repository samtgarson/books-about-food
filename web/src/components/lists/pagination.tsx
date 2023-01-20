'use client'

import { FC, ReactNode, useRef } from 'react'
import { Pill } from 'src/components/atoms/pill'

export type PaginationProps = {
  filteredTotal?: number
  total: number
  perPage: number
  page: number
  onChange: (page: number) => void
  onPreload?: (page: number) => void
  children: ReactNode
}

export const Pagination: FC<PaginationProps> = ({
  total,
  filteredTotal = total,
  perPage,
  page,
  onChange,
  onPreload,
  children
}) => {
  const totalPages = Math.ceil(filteredTotal / perPage)
  const anchor = useRef<HTMLDivElement>(null)
  const pages = Array.from({ length: totalPages }, (_, i) => i)
  const scrollToTop = () => {
    anchor.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div ref={anchor} className="h-px w-full" />
      {children}
      <ul className="flex gap-2 mt-20 flex-wrap">
        {pages.map((p) => (
          <li key={p} className="list-none">
            <Pill
              onClick={async () => {
                onChange(p)
                scrollToTop()
              }}
              onMouseOver={() => onPreload?.(p)}
              selected={page === p}
              disabled={page === p}
              className="w-10 h-11 !p-0"
            >
              {p + 1}
            </Pill>
          </li>
        ))}
      </ul>
    </>
  )
}
