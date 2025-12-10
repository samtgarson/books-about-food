'use server'

import { fetchJobs } from '@books-about-food/core/services/jobs/fetch-jobs'
import { fetchLocationFilterOptions } from '@books-about-food/core/services/locations/fetch-location-filter-options'
import { call } from 'src/utils/service'

export async function locationOptions(
  _query: string,
  _existingIds: string[] = []
) {
  const { data = [] } = await call(fetchLocationFilterOptions, { limit: false })
  return data.map(({ value: label, id: value }) => ({
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
