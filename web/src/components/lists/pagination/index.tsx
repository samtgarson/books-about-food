import cn from 'classnames'
import { Fragment, ReactNode, useMemo } from 'react'
import { Pill } from 'src/components/atoms/pill'
import { Button, Wrapper } from './utils'

export type PaginationProps = {
  filteredTotal?: number
  total: number
  perPage: number | 'all'
  page?: number
  children: ReactNode
  onPageClick?: (page: number) => void
}

export function Pagination({ children, ...props }: PaginationProps) {
  return (
    <Wrapper>
      {children}
      <PaginationButtons className="mt-20" {...props} />
    </Wrapper>
  )
}

export function PaginationButtons({
  total,
  filteredTotal = total,
  perPage,
  page,
  onPageClick,
  className
}: Omit<PaginationProps, 'children'> & { className?: string }) {
  const totalPages = perPage === 'all' ? 1 : Math.ceil(filteredTotal / perPage)

  const displayPages = useMemo(() => {
    const pages = Array.from({ length: totalPages }, (_, i) => i)
    if (typeof page === 'undefined') return [pages]

    if (totalPages <= 5) return [pages]
    if (page < 4) return [pages.slice(0, 5), pages.slice(-1)]
    if (page > totalPages - 5) return [pages.slice(0, 1), pages.slice(-5)]
    return [pages.slice(0, 1), pages.slice(page - 2, page + 3), pages.slice(-1)]
  }, [page, totalPages])

  if (totalPages <= 1) return null

  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {displayPages.map((pageGroup, i) => (
        <Fragment key={`group-${i}`}>
          {pageGroup.map((p) => (
            <Button
              page={p}
              key={p}
              onClick={onPageClick ? () => onPageClick(p) : undefined}
            >
              <Pill
                selected={page === p}
                disabled={page === p}
                className="p-0! h-10 w-10"
                title={`Page ${p + 1}`}
              >
                {p + 1}
              </Pill>
            </Button>
          ))}
          {i < displayPages.length - 1 && (
            <li className="list-none" key={`ellipsis-${i}`}>
              <Pill className="p-0! h-10 w-10" disabled>
                …
              </Pill>
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  )
}
