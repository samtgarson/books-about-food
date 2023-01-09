import { Suspense } from 'react'
import { pathFor } from 'src/utils/path-helpers'
import { PublishersFilters } from './filters'
import { PublishersList } from './list'

type PublishersProps = { searchParams: { page: number; search?: string } }

export default async ({ searchParams: { page, search } }: PublishersProps) => {
  const currentPath = pathFor('/publishers', { search })

  return (
    <div>
      <h1>Publishers</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Server Component */}
        <PublishersFilters currentPath={currentPath} filters={{ search }} />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Server Component */}
        <PublishersList currentPath={currentPath} filters={{ page, search }} />
      </Suspense>
    </div>
  )
}
