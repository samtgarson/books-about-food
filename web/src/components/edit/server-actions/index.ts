'use server'

import { fetchJobs } from '@books-about-food/core/services/jobs/fetch-jobs'
import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { fetchTags } from '@books-about-food/core/services/tags/fetch'
import { profileIncludes } from '@books-about-food/core/services/utils'
import prisma from '@books-about-food/database'
import { slugify } from '@books-about-food/shared/utils/slugify'
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
