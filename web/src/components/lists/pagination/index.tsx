import { FC, Fragment, ReactNode, useMemo } from 'react'
import { Pill } from 'src/components/atoms/pill'
import { Button, Wrapper } from './utils'

export type PaginationProps = {
  filteredTotal?: number
  total: number
  perPage: number
  page?: number
  children: ReactNode
  onPageClick?: (page: number) => void
}

export const Pagination: FC<PaginationProps> = ({
  total,
  filteredTotal = total,
  perPage,
  page,
  children,
  onPageClick
}) => {
  const totalPages = Math.ceil(filteredTotal / perPage)

  const displayPages = useMemo(() => {
    const pages = Array.from({ length: totalPages }, (_, i) => i)
    if (typeof page === 'undefined') return [pages]

    if (totalPages <= 5) return [pages]
    if (page < 4) return [pages.slice(0, 5), pages.slice(-1)]
    if (page > totalPages - 5) return [pages.slice(0, 1), pages.slice(-5)]
    return [pages.slice(0, 1), pages.slice(page - 2, page + 3), pages.slice(-1)]
  }, [page, totalPages])

  if (totalPages <= 1) return <>{children}</>
  return (
    <Wrapper>
      {children}
      {totalPages > 1 && (
        <ul className="mt-20 flex flex-wrap gap-2">
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
                    className="h-10 w-10 !p-0"
                    title={`Page ${p + 1}`}
                  >
                    {p + 1}
                  </Pill>
                </Button>
              ))}
              {i < displayPages.length - 1 && (
                <li className="list-none" key={`ellipsis-${i}`}>
                  <Pill className="h-10 w-10 !p-0" disabled>
                    …
                  </Pill>
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      )}
    </Wrapper>
  )
}
