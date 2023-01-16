'use client'

import { Container } from 'src/components/atoms/container'
import { Pill } from 'src/components/atoms/pill'
import { useFetcher } from 'src/contexts/fetcher'

type PeopleFiltersProps = {
  value: string[]
  onChange: (jobs: string[]) => void
  onReset?: () => void
}

export const PeopleFilters = ({
  value = [],
  onChange,
  onReset
}: PeopleFiltersProps) => {
  const { data: jobs } = useFetcher('jobs', undefined, { immutable: true })

  const onClick = (job: string) =>
    value.includes(job)
      ? onChange(value.filter((j) => j !== job))
      : onChange([...value, job])

  return (
    <div className='my-10 flex flex-col gap-4'>
      <Container>
        <p className='all-caps'>Showing</p>
      </Container>
      <div className='overflow-x-auto scroll-smooth scrollbar-hidden'>
        <Container className='flex flex-nowrap gap-4 w-max'>
          <Pill
            key={'all'}
            onClick={() => onReset?.()}
            selected={value.length === 0}
          >
            All
          </Pill>
          {!jobs && <Pill className='opacity-50'>Loading...</Pill>}
          {jobs?.map(
            (job) =>
              job.name !== 'Author' && (
                <Pill
                  key={job.id}
                  onClick={() => onClick(job.id)}
                  selected={value.includes(job.id)}
                >
                  {job.name}
                </Pill>
              )
          )}
        </Container>
      </div>
    </div>
  )
}
