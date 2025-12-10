'use server'

import { fetchJobs } from '@books-about-food/core/services/jobs/fetch-jobs'
import { fetchLocationFilterOption } from '@books-about-food/core/services/locations/fetch-location-filter-option'
import {
  fetchLocationFilterOptions,
  FetchLocationFilterOptionsInput
} from '@books-about-food/core/services/locations/fetch-location-filter-options'
import { call } from 'src/utils/service'

export async function locationOptions(
  query: string,
  existingIds: string[] = []
) {
  const shortQuery = query.length < 2
  const options: FetchLocationFilterOptionsInput = {
    query: shortQuery ? null : query,
    sort: shortQuery ? 'popularity' : 'relevance',
    limit: shortQuery ? 5 : 20
  }

  const [result, ...extraResults] = await Promise.all([
    call(fetchLocationFilterOptions, options),
    ...existingIds.map((id) => call(fetchLocationFilterOption, { id }))
  ])

  if (!result.success) {
    console.error('Failed to search location filters:', result.errors)
    return []
  }

  const extraOptions = extraResults.flatMap(function (res) {
    if (result.data.some((option) => option.id === res.data?.id)) return []
    return res.data || []
  })

  return [...result.data, ...extraOptions].map(
    ({ value: label, id: value }) => ({
      label,
      value
    })
  )
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
