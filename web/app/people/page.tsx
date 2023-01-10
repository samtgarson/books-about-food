import { Suspense } from 'react'
import { pathFor } from 'src/utils/path-helpers'
import { PeopleFilters } from './filters'
import { PeopleList } from './list'

type PeopleProps = { searchParams: { page: number; jobs?: string[] } }

export const dynamic = 'force-dynamic'

export default async ({ searchParams: { page, jobs } }: PeopleProps) => {
  const currentPath = pathFor('/people', { jobs })

  return (
    <div>
      <h1>People</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Server Component */}
        <PeopleFilters currentPath={currentPath} filters={{ jobs }} />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Server Component */}
        <PeopleList currentPath={currentPath} filters={{ page, jobs }} />
      </Suspense>
    </div>
  )
}
