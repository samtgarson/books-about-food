'use server'

import { fetchJobs } from '@books-about-food/core/services/jobs/fetch-jobs'
import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { fetchTags } from '@books-about-food/core/services/tags/fetch'
import { call } from 'src/utils/service'
import { stringify } from 'src/utils/superjson'

export const profiles = async (search: string) => {
  const { data } = await call(fetchProfiles, { search })
  return stringify(data?.profiles ?? [])
}

export const jobs = async (search?: string) => {
  const { data: jobs } = await call(fetchJobs, { search })
  return stringify(jobs ?? [])
}

export const tags = async (search?: string) => {
  const { data: tags } = await call(fetchTags, { search })
  return stringify(tags ?? [])
}
