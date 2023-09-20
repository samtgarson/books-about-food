import { FC, Fragment, ReactNode, useMemo } from 'react'
import { Pill } from 'src/components/atoms/pill'
import { Button, Wrapper } from './utils'

export type PaginationProps = {
  filteredTotal?: number
  total: number
  perPage: number
  page: number
  children: ReactNode
}

export const Pagination: FC<PaginationProps> = ({
  total,
  filteredTotal = total,
  perPage,
  page,
  children
}) => {
  const totalPages = Math.ceil(filteredTotal / perPage)

  const displayPages = useMemo(() => {
    const pages = Array.from({ length: totalPages }, (_, i) => i)
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
        <ul className="flex gap-2 mt-20 flex-wrap">
          {displayPages.map((pageGroup, i) => (
            <Fragment key={`group-${i}`}>
              {pageGroup.map((p) => (
                <Button page={p} key={p}>
                  <Pill
                    selected={page === p}
                    disabled={page === p}
                    className="w-10 h-10 !p-0"
                    title={`Page ${p + 1}`}
                  >
                    {p + 1}
                  </Pill>
                </Button>
              ))}
              {i < displayPages.length - 1 && (
                <li className="list-none" key={`ellipsis-${i}`}>
                  <Pill className="w-10 h-10 !p-0" disabled>
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
