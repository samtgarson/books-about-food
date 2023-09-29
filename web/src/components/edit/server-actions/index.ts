'use server'

import { fetchJobs } from 'src/services/jobs/fetch-jobs'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { fetchTags } from 'src/services/tags/fetch'
import { stringify } from 'src/utils/superjson'

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
