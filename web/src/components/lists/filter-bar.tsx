import { FC } from 'react'
import { AntiContainer, Container } from '../atoms/container'

export type FilterBarProps = {
  children?: React.ReactNode
  search?: React.ReactNode
  label?: string
}

export const FilterBar: FC<FilterBarProps> = ({
  children,
  search,
  label = 'Sort & Filter'
}) => (
  <AntiContainer desktop={false}>
    <div className="mb-6 md:mb-10 flex flex-wrap items-center gap-3 md:gap-4 w-full">
      {search && (
        <Container desktop={false} className="w-full flex-grow md:w-72 flex">
          {search}
        </Container>
      )}
      {children && (
        <div className="overflow-x-auto ml-auto">
          <Container desktop={false} className="flex gap-2 w-max items-center">
            <p className="all-caps mr-2">{label}</p>
            {children}
          </Container>
        </div>
      )}
    </div>
  </AntiContainer>
)
