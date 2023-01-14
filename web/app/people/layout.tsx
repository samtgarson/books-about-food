import { ReactNode } from 'react'
import { FetchProvider } from 'src/contexts/fetcher'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { fetcherData } from 'src/utils/fetcher-helpers'

export default async ({ children }: { children: ReactNode }) => {
  const args = { onlyAuthors: false }
  const data = await fetchProfiles.call(args)

  return (
    <FetchProvider data={[fetcherData('profiles', data, args)]} data-superjson>
      {children}
    </FetchProvider>
  )
}
