import { Profile } from 'src/core/models/profile'
import { Service } from 'src/core/services/base'
import { PROFILE_DEPTH } from 'src/core/services/utils/payload-depth'
import { z } from 'zod'
import { array, paginationInput, slug } from '../utils/inputs'
import { fetchProfilePageIds } from './fetch-profile-page'

export type FetchProfilesInput = NonNullable<
  z.infer<(typeof fetchProfiles)['input']>
>
export type FetchProfilesOutput = Awaited<
  ReturnType<(typeof fetchProfiles)['call']>
>

// Define location filter type supporting both slugs and composite filters
const locationFilterSchema = z.union([
  slug,
  z.custom<`${'country' | 'region'}:${string}`>(
    (val) => {
      if (typeof val !== 'string') return false
      return /^(country|region):.+$/.test(val)
    },
    { message: 'Must be a slug or composite filter like "country:France"' }
  )
])

export const fetchProfiles = new Service(
  z.object({
    userId: z.string().optional(),
    locations: array(locationFilterSchema).optional(),
    sort: z.enum(['name', 'trending']).optional(),
    search: z.string().trim().optional(),
    jobs: array(z.string()).optional(),
    onlyPublished: z.boolean().optional(),
    withAvatar: z.boolean().optional(),
    ...paginationInput.shape
  }),
  async (
    {
      page = 0,
      perPage = 24,
      userId,
      locations,
      jobs,
      sort = 'name',
      search,
      onlyPublished = true,
      withAvatar
    },
    { payload }
  ) => {
    const { ids, total } = await fetchProfilePageIds(payload, {
      page,
      perPage,
      userId,
      locations,
      jobs,
      sort,
      search,
      onlyPublished,
      withAvatar
    })

    const result = await payload.find({
      collection: 'profiles',
      where: { id: { in: ids } },
      pagination: false,
      depth: PROFILE_DEPTH
    })

    const docsById = new Map(
      result.docs.map((profile) => [profile.id, profile])
    )
    const profileModels = ids.flatMap((id) => {
      const profile = docsById.get(id)
      return profile ? [new Profile(profile)] : []
    })

    return {
      profiles: profileModels,
      total,
      perPage: perPage === 'all' ? ('all' as const) : perPage
    }
  },
  { cache: 'fetch-profiles' }
)
