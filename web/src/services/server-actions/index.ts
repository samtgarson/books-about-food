'use server'

import { stringify } from 'src/utils/superjson'
import { fetchProfiles } from '../profiles/fetch-profiles'
import { fetchJobs } from '../jobs/fetch-jobs'
import { fetchTags } from '../tags/fetch'

export const profiles = async (search: string) => {
  const { profiles } = await fetchProfiles.call({ search })
  return stringify(profiles)
}

export const jobs = async () => {
  const jobs = await fetchJobs.call()
  return stringify(jobs)
}

export const tags = async () => {
  const tags = await fetchTags.call()
  return stringify(tags)
}
