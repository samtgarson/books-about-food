import { Suspense } from 'react'
import { pathFor } from 'src/utils/path-helpers'
import { AuthorsList } from './list'

type AuthorsProps = { searchParams: { page: number } }

export const dynamic = 'force-dynamic'

export default async ({ searchParams: { page } }: AuthorsProps) => {
  const currentPath = pathFor('/authors', { page })

  return (
    <div>
      <h1>Authors</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Server Component */}
        <AuthorsList currentPath={currentPath} filters={{ page }} />
      </Suspense>
    </div>
  )
}
