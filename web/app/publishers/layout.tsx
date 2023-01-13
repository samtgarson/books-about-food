import { ReactNode } from 'react'
import { ServerRender } from 'src/components/util/server-render'
import { FetchProvider } from 'src/contexts/fetcher'
import { fetchPublishers } from 'src/services/publishers/fetch-publishers'
import { fetcherData } from 'src/utils/fetcher-helpers'

export default async ({ children }: { children: ReactNode }) => {
  const data = await fetchPublishers.call()

  return (
    <ServerRender
      component={FetchProvider}
      data={[fetcherData('publishers', data)]}
    >
      {children}
    </ServerRender>
  )
}
