'use server'

import prisma from '@books-about-food/database'
import { slugify } from '@books-about-food/shared/utils/slugify'
import { fetchJobs } from 'src/core/services/jobs/fetch-jobs'
import { fetchProfiles } from 'src/core/services/profiles/fetch-profiles'
import { fetchTags } from 'src/core/services/tags/fetch'
import { profileIncludes } from 'src/core/services/utils'
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
  const profile = await prisma.profile.create({
    data: { name, slug: slugify(name) },
    include: profileIncludes
  })
  return profile
}
