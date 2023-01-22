'use client'

import { pluralize } from 'inflection'
import { AntiContainer, Container } from 'src/components/atoms/container'
import { Pill } from 'src/components/atoms/pill'
import { useFetcher } from 'src/contexts/fetcher'

type PeopleFiltersProps = {
  value: string[]
  onChange: (jobs: string[]) => void
  onReset?: () => void
  onPreload?: (jobs: string[]) => void
}

export const PeopleFilters = ({
  value = [],
  onChange,
  onPreload,
  onReset
}: PeopleFiltersProps) => {
  const { data: jobs } = useFetcher('jobs', undefined, { immutable: true })

  const toggle = (job: string) =>
    value.includes(job) ? value.filter((j) => j !== job) : [...value, job]

  return (
    <div className="my-10 flex flex-col gap-4">
      <p className="all-caps">Showing</p>
      <AntiContainer className="overflow-x-auto scroll-smooth scrollbar-hidden">
        <Container className="flex flex-nowrap gap-4 w-max">
          <Pill
            key={'all'}
            onClick={() => onReset?.()}
            selected={value.length === 0}
          >
            All
          </Pill>
          {!jobs && <Pill className="opacity-50">Loading...</Pill>}
          {jobs?.map(
            (job) =>
              job.name !== 'Author' && (
                <Pill
                  key={job.id}
                  onClick={() => onChange(toggle(job.id))}
                  selected={value.includes(job.id)}
                  onMouseOver={() => onPreload?.(toggle(job.id))}
                >
                  {pluralize(job.name)}
                </Pill>
              )
          )}
        </Container>
      </AntiContainer>
    </div>
  )
}
