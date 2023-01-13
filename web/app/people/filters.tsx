'use client'

import { useFetcher } from 'src/contexts/fetcher'

type PeopleFiltersProps = {
  value: string[]
  onChange: (jobs: string[]) => void
}

export const PeopleFilters = ({ value = [], onChange }: PeopleFiltersProps) => {
  const { data: jobs } = useFetcher('jobs', undefined, { immutable: true })

  const onClick = (job: string) =>
    value.includes(job)
      ? onChange(value.filter((j) => j !== job))
      : onChange([...value, job])

  if (!jobs) return <div>Loading</div>
  return (
    <ul className='flex flex-wrap gap-4'>
      {jobs.map(
        (job) =>
          job.name !== 'Author' && (
            <button
              key={job.id}
              onClick={() => onClick(job.id)}
              className={value.includes(job.id) ? 'font-bold' : ''}
            >
              {job.name}
            </button>
          )
      )}
    </ul>
  )
}
