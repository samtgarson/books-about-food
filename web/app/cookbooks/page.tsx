import { Suspense } from 'react'
import { FetchBooksOptions } from 'src/services/books/fetch-books'
import { pathFor } from 'src/utils/path-helpers'
import { CookbooksFilters } from './filters'
import { CookbooksList } from './list'

type CookbooksProps = { searchParams: FetchBooksOptions }

export const dynamic = 'force-dynamic'

export default async ({
  searchParams: { page, sort, tag, search }
}: CookbooksProps) => {
  const currentPath = pathFor('/cookbooks', { sort, tag, search })

  return (
    <div>
      <h1>Books</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Server Component */}
        <CookbooksFilters
          currentPath={currentPath}
          filters={{ page, sort, tag, search }}
        />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Server Component */}
        <CookbooksList
          currentPath={currentPath}
          filters={{ page, sort, tag, search }}
        />
      </Suspense>
    </div>
  )
}
