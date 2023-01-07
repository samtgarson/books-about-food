import { FC } from 'react'
import { addParam } from 'src/utils/path-helpers'

export type SortProps = {
  sorts: Record<string, string>
  currentSort?: string
  path: string
}

export const Sort: FC<SortProps> = ({ sorts, currentSort, path }) => {
  return (
    <ul className='flex gap-2'>
      {Object.entries(sorts).map(([sort, label]) => (
        <li key={sort} className='list-none'>
          {sort === currentSort ? (
            <span className='text-gray-500'>{label}</span>
          ) : (
            <a href={addParam(path, 'sort', sort)}>{label}</a>
          )}
        </li>
      ))}
    </ul>
  )
}
