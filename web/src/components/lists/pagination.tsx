'use client'

import { FC, Fragment, ReactNode, useMemo, useRef } from 'react'
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
  const scrollToTop = () => {
    anchor.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const displayPages = useMemo(() => {
    const pages = Array.from({ length: totalPages }, (_, i) => i)
    if (totalPages <= 5) return [pages]
    if (page < 3) return [pages.slice(0, 4), pages.slice(-1)]
    if (page > totalPages - 3) return [pages.slice(0, 1), pages.slice(-4)]
    return [pages.slice(0, 1), pages.slice(page - 2, page + 1), pages.slice(-1)]
  }, [page, totalPages])

  return (
    <>
      <div ref={anchor} className="h-px w-full" />
      {children}
      <ul className="flex gap-2 mt-20 flex-wrap">
        {displayPages.map((pageGroup, i) => (
          <Fragment key={`group-${i}`}>
            {pageGroup.map((p) => (
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
                  title={`Page ${p + 1}`}
                >
                  {p + 1}
                </Pill>
              </li>
            ))}
            {i < displayPages.length - 1 && (
              <li className="list-none" key={`ellipsis-${i}`}>
                <Pill className="w-10 h-11 !p-0" disabled>
                  …
                </Pill>
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </>
  )
}
