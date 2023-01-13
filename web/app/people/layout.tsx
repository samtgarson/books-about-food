import { ReactNode } from 'react'
import { ServerRender } from 'src/components/util/server-render'
import { FetchProvider } from 'src/contexts/fetcher'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { fetcherData } from 'src/utils/fetcher-helpers'

export default async ({ children }: { children: ReactNode }) => {
  const args = { onlyAuthors: false }
  const data = await fetchProfiles.call(args)

  return (
    <ServerRender
      component={FetchProvider}
      data={[fetcherData('profiles', data, args)]}
    >
      {children}
    </ServerRender>
  )
}
