'use server'

import { fetchJobs } from 'src/core/services/jobs/fetch-jobs'
import { fetchProfiles } from 'src/core/services/profiles/fetch-profiles'
import { findOrCreateProfile } from 'src/core/services/profiles/find-or-create-profile'
import { fetchTags } from 'src/core/services/tags/fetch'
import { call } from 'src/utils/service'
import { stringify } from 'src/utils/superjson'

export async function profiles(search: string) {
  const { data } = await call(fetchProfiles, { search, onlyPublished: false })
  return stringify(data?.profiles ?? [])
}

export async function jobs(search?: string) {
  const { data: jobs } = await call(fetchJobs, { search })
  return stringify(jobs ?? [])
}

export async function tags(search?: string) {
  const { data: tags } = await call(fetchTags, { search })
  return stringify(tags ?? [])
}

export async function createProfile(name: string) {
  return await call(findOrCreateProfile, { name })
}
