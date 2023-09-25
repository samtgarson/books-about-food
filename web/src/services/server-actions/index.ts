'use server'

import { stringify } from 'src/utils/superjson'
import { fetchJobs } from '../jobs/fetch-jobs'
import { fetchProfiles } from '../profiles/fetch-profiles'
import { fetchTags } from '../tags/fetch'

export const profiles = async (search: string) => {
  const { data } = await fetchProfiles.call({ search })
  return stringify(data?.profiles ?? [])
}

export const jobs = async (search?: string) => {
  const { data: jobs } = await fetchJobs.call({ search })
  return stringify(jobs ?? [])
}

export const tags = async (search?: string) => {
  const { data: tags } = await fetchTags.call({ search })
  return stringify(tags ?? [])
}
