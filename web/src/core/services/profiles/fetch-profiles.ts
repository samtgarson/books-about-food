import { JoinQuery, Where } from 'payload'
import { Profile } from 'src/core/models/profile'
import { Service } from 'src/core/services/base'
import { PROFILE_DEPTH } from 'src/core/services/utils/payload-depth'
import { z } from 'zod'
import { array, paginationInput, slug } from '../utils/inputs'

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
    const joins: JoinQuery<'profiles'> = {}
    const where: Where = {
      name: { not_equals: '' },
      and: []
    }

    // User filter
    if (userId) {
      where.user = { equals: userId }
    }

    // Location filter
    if (locations && locations.length > 0) {
      const locationConditions = buildPayloadLocationFilter(locations)
      if (locationConditions) {
        where.and!.push(locationConditions)
      }
    }

    // Search filter
    if (search) {
      where.and!.push({
        or: [{ name: { contains: search } }, { jobTitle: { contains: search } }]
      })
    }

    // Job filter
    if (jobs && jobs.length > 0) {
      const jobConditions: Where[] = []
      const hasAuthor = jobs.includes('author')
      const jobsWithoutAuthor = jobs.filter((job) => job !== 'author')

      if (jobsWithoutAuthor.length > 0) {
        jobConditions.push({
          'contributions.job.id': { in: jobs }
        })
      }

      if (hasAuthor) {
        jobConditions.push({ authoredBooks: { exists: true } })
      }

      if (jobConditions.length > 0) {
        where.and!.push({ or: jobConditions })
      }
    }

    // Only published filter
    if (onlyPublished) {
      joins.contributions = { where: { status: { equals: 'published' } } }
      where.and!.push({
        or: [
          { 'authoredBooks.status': { equals: 'published' } }
          // { 'contributions.status': { equals: 'published' } }
        ]
      })
    }

    // Avatar filter
    if (withAvatar) {
      where.avatar = { exists: true }
    }

    const sortField = sort === 'name' ? 'name' : '-mostRecentlyPublishedOn'

    // Fetch profiles
    const result = await payload.find({
      collection: 'profiles',
      where,
      ...(perPage === 'all'
        ? { pagination: false }
        : { page: page + 1, limit: perPage }),
      sort: sortField,
      depth: PROFILE_DEPTH,
      joins
    })

    const profiles = result.docs.map((profile) => new Profile(profile))

    return {
      profiles,
      total: result.totalDocs,
      perPage: perPage === 'all' ? ('all' as const) : perPage
    }
  },
  { cache: 'fetch-profiles' }
)

function buildPayloadLocationFilter(locations: string[]): Where | null {
  if (!locations || locations.length === 0) return null

  const slugFilters: string[] = []
  const compositeFilters: Array<{ type: string; value: string }> = []

  for (const filter of locations) {
    if (filter.includes(':')) {
      const [type, value] = filter.split(':', 2)
      compositeFilters.push({ type, value })
    } else {
      slugFilters.push(filter)
    }
  }

  const byType = {
    region: compositeFilters
      .filter((f) => f.type === 'region')
      .map((f) => f.value),
    country: compositeFilters
      .filter((f) => f.type === 'country')
      .map((f) => f.value)
  }

  const locationConditions: Where[] = []

  if (slugFilters.length > 0) {
    locationConditions.push({ 'locations.slug': { in: slugFilters } })
  }

  if (byType.region.length > 0) {
    locationConditions.push({ 'locations.region': { in: byType.region } })
  }

  if (byType.country.length > 0) {
    locationConditions.push({ 'locations.country': { in: byType.country } })
  }

  if (locationConditions.length === 0) return null
  if (locationConditions.length === 1) return locationConditions[0]

  return { or: locationConditions }
}
