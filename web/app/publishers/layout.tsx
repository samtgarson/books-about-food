import { ReactNode } from 'react'
import { FetchProvider } from 'src/contexts/fetcher'
import { fetchPublishers } from 'src/services/publishers/fetch-publishers'
import { fetcherData } from 'src/utils/fetcher-helpers'

export default async ({ children }: { children: ReactNode }) => {
  const data = await fetchPublishers.call()

  return (
    <FetchProvider data={[fetcherData('publishers', data)]} data-superjson>
      {children}
    </FetchProvider>
  )
}
