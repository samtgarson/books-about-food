import Link from 'next/link'
import { FC } from 'react'
import { addParam } from 'src/utils/path-helpers'

export type PaginationProps = {
  total: number
  perPage: number
  page: number
  path: string
}

export const Pagination: FC<PaginationProps> = ({
  total,
  perPage,
  page,
  path
}) => {
  const totalPages = Math.ceil(total / perPage)
  const pages = Array.from({ length: totalPages }, (_, i) => i)

  return (
    <ul className='flex gap-2'>
      {pages.map((p) => (
        <li key={p} className='list-none'>
          {p === page ? (
            <span className='text-gray-500'>{p + 1}</span>
          ) : (
            <Link href={addParam(path, 'page', p)}>{p + 1}</Link>
          )}
        </li>
      ))}
    </ul>
  )
}
