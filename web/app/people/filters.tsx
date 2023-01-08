import { Job } from 'database'
import Link from 'next/link'
import { fetchJobs } from 'src/services/jobs/fetch'
import { addParam } from 'src/utils/path-helpers'

type PeopleFiltersProps = {
  currentPath: string
  filters: { jobs: string | string[] }
}

export const PeopleFilters = async ({
  currentPath,
  filters: { jobs: jobsInput = [] }
}: PeopleFiltersProps) => {
  const currentJobs = Array.isArray(jobsInput) ? jobsInput : [jobsInput]
  const jobs = await fetchJobs()

  const jobSelected = (job: Job) => currentJobs.includes(job.name)
  const filterUrl = (job: Job) => {
    if (jobSelected(job))
      return addParam(
        currentPath,
        'jobs',
        currentJobs.filter((j) => j !== job.name)
      )
    return addParam(currentPath, 'jobs', [...currentJobs, job.name])
  }

  return (
    <ul className='flex flex-wrap gap-4'>
      {jobs.map(
        (job) =>
          job.name !== 'Author' && (
            <Link
              key={job.id}
              href={filterUrl(job)}
              className={jobSelected(job) ? 'font-bold' : ''}
            >
              {job.name}
            </Link>
          )
      )}
    </ul>
  )
}
