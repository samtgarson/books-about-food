'use server'

import { fetchJobs } from '@books-about-food/core/services/jobs/fetch-jobs'
import {
  searchLocationOptions,
  SearchLocationOptionsInput
} from '@books-about-food/core/services/locations/search-location-options'
import { call } from 'src/utils/service'

export async function locationOptions(
  query: string,
  _existingIds: string[] = []
) {
  const shortQuery = query.length < 2
  const options: SearchLocationOptionsInput = {
    query: shortQuery ? null : query,
    sort: shortQuery ? 'popularity' : 'relevance',
    limit: shortQuery ? 5 : 20
  }

  const result = await call(searchLocationOptions, options)

  if (!result.success) {
    console.error('Failed to search location filters:', result.errors)
    return []
  }

  return result.data.map(({ value: label, id: value }) => ({
    label,
    value
  }))
}

export async function jobOptions() {
  'use server'

  const { data: jobs = [] } = await call(fetchJobs, {})
  return jobs
    .map((job) => ({
      label: job.name,
      value: job.id
    }))
    .concat({ label: 'Author', value: 'author' })
}
